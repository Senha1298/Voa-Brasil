import type { Express } from "express";
import { createServer, type Server } from "http";

class PagnetAPI {
  private publicKey: string;
  private secretKey: string;
  private baseUrl: string = "https://api.pagnetbrasil.com/v1";

  constructor(publicKey: string, secretKey: string) {
    this.publicKey = publicKey;
    this.secretKey = secretKey;
    
    if (!this.publicKey || !this.secretKey) {
      console.error('[PAGNET] ERRO: Chaves de API não configuradas');
      console.error('[PAGNET] PAGNET_PUBLIC_KEY:', publicKey ? 'SET' : 'MISSING');
      console.error('[PAGNET] PAGNET_SECRET_KEY:', secretKey ? 'SET' : 'MISSING');
      throw new Error('PAGNET_PUBLIC_KEY e PAGNET_SECRET_KEY são obrigatórias');
    }
    
    console.log('[PAGNET] API client inicializada com sucesso');
  }

  private getHeaders() {
    const authString = `${this.publicKey}:${this.secretKey}`;
    const authBase64 = Buffer.from(authString).toString('base64');
    
    return {
      'Authorization': `Basic ${authBase64}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
  }

  private generateTransactionId(): string {
    const now = new Date();
    const timestamp = now.toISOString().replace(/[-T:.Z]/g, '').substring(0, 14);
    const randomId = Math.random().toString(36).substring(2, 10).toUpperCase();
    return `PIX${timestamp}${randomId}`;
  }

  async createPixTransaction(data: any) {
    try {
      console.log(`[PAGNET] Iniciando criação de transação PIX - Valor: R$ ${data.amount}`);
      
      const transactionId = this.generateTransactionId();
      const amountInCents = Math.round(data.amount * 100);

      // Prepare customer data
      const customerName = data.customer_name || 'Cliente';
      const customerCpf = (data.customer_cpf || '').replace(/\D/g, '');
      const customerEmail = data.customer_email || 'cliente@email.com';
      const customerPhone = (data.customer_phone || '11999999999').replace(/\D/g, '');

      console.log(`[PAGNET] Dados da transação: Nome=${customerName}, CPF=${customerCpf}, Valor=R$${data.amount} (${amountInCents} centavos)`);

      // Prepare the payload according to Pagnet documentation
      const payload = {
        amount: amountInCents,
        paymentMethod: "pix",
        pix: {
          expiresInDays: 3
        },
        items: [
          {
            title: "Taxa ANAC",
            unitPrice: amountInCents,
            quantity: 1,
            tangible: false
          }
        ],
        customer: {
          name: customerName,
          email: customerEmail,
          document: {
            type: "cpf",
            number: customerCpf
          },
          phone: customerPhone
        },
        externalReference: transactionId,
        notificationUrl: "https://irpf.intimacao.org/pagnet-postback"
      };

      console.log('[PAGNET] Payload preparado:', JSON.stringify(payload, null, 2));

      const response = await fetch(`${this.baseUrl}/transactions`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload)
      });

      console.log(`[PAGNET] Status da resposta: ${response.status}`);

      if (response.status === 200 || response.status === 201) {
        const responseData = await response.json();
        console.log('[PAGNET] Resposta da API:', JSON.stringify(responseData, null, 2));

        // Extract PIX data from response
        const pixCode = responseData.pix?.qrcode || responseData.qrCode || responseData.qrcode;
        const transactionIdResponse = responseData.id || responseData.transactionId || transactionId;

        if (!pixCode) {
          console.error(`[PAGNET] Código PIX não encontrado na resposta:`, responseData);
          throw new Error('Código PIX não foi gerado pela API');
        }

        const result = {
          success: true,
          transaction_id: transactionIdResponse,
          order_id: transactionIdResponse,
          amount: data.amount,
          status: responseData.status || 'pending',
          created_at: responseData.createdAt || new Date().toISOString(),
          pix_code: pixCode,
          qr_code_image: '',
          external_reference: transactionId,
          raw_response: responseData
        };

        console.log(`[PAGNET] ✅ Transação criada com sucesso: ${transactionIdResponse}`);
        return result;

      } else {
        const errorText = await response.text();
        console.error(`[PAGNET] ❌ Erro na API - Status: ${response.status}, Resposta: ${errorText}`);

        let errorMessage = errorText;
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorText;
        } catch (e) {
          // Keep original error text if not JSON
        }

        throw new Error(`Erro da API Pagnet: ${errorMessage}`);
      }

    } catch (error: any) {
      console.error(`[PAGNET] ❌ Erro inesperado:`, error);
      
      if (error.message.includes('fetch')) {
        throw new Error('Erro de conexão com a API Pagnet');
      }
      
      throw error;
    }
  }

  async checkTransactionStatus(transactionId: string) {
    try {
      const response = await fetch(`${this.baseUrl}/transactions/${transactionId}`, {
        method: 'GET',
        headers: this.getHeaders()
      });

      if (response.status === 200) {
        const data = await response.json();
        return {
          success: true,
          status: data.status || 'unknown',
          data: data
        };
      } else {
        return {
          success: false,
          error: `Status code: ${response.status}`
        };
      }

    } catch (error: any) {
      console.error(`[PAGNET] Erro ao verificar status:`, error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

export function registerRoutes(app: Express): Server {
  // Create PIX transaction endpoint
  app.post("/api/create-pix", async (req, res) => {
    try {
      const { amount, customer_name, customer_email, customer_phone, customer_cpf } = req.body;

      // Validate required fields
      if (!amount || !customer_name) {
        return res.status(400).json({
          success: false,
          error: "Campos obrigatórios: amount, customer_name"
        });
      }

      // Check for Pagnet API keys
      const publicKey = process.env.PAGNET_PUBLIC_KEY;
      const secretKey = process.env.PAGNET_SECRET_KEY;
      if (!publicKey || !secretKey) {
        return res.status(500).json({
          success: false,
          error: "Chaves da API Pagnet não configuradas (PAGNET_PUBLIC_KEY e PAGNET_SECRET_KEY)"
        });
      }

      const pagnet = new PagnetAPI(publicKey, secretKey);
      const transaction = await pagnet.createPixTransaction({
        amount: parseFloat(amount),
        customer_name,
        customer_email,
        customer_phone,
        customer_cpf
      });

      res.json(transaction);
    } catch (error) {
      console.error("Erro ao criar transação PIX:", error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Erro interno do servidor"
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
