import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.image import MIMEImage
import mercadopago
from fastapi import FastAPI, HTTPException, Request, BackgroundTasks
import requests
from datetime import datetime
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

# Carrega as variáveis do arquivo .env
load_dotenv(override=True)

app = FastAPI(title="Amazon Tech API")

# Configuração de CORS para permitir que o Frontend (React) acesse a API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Em produção, substitua "*" pela URL do seu frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

sdk = mercadopago.SDK(os.getenv("MP_ACCESS_TOKEN"))
token = os.getenv("MP_ACCESS_TOKEN")
if token:
    print(f"DEBUG: Token loaded. Length: {len(token)}, Starts with: {token[:12]}..., Ends with: ...{token[-10:]}")
else:
    print("DEBUG: Token is None!")

# Modelo Pydantic para validar os dados vindos do frontend
class CheckoutData(BaseModel):
    nome: str
    email: str
    cpf: str
    telefone: str
    perfil: str # 'graduando' ou 'profissional'
    valor: float # 1.00 para testes

from typing import Optional

class CheckoutDataCartao(BaseModel):
    transaction_amount: float
    token: str
    installments: int
    payment_method_id: str
    issuer_id: Optional[str] = None
    payer: dict
    metadata: Optional[dict] = None

def enviar_email_confirmacao(email_destino: str, id_pagamento: str, nome_cliente: str = ""):
    remetente = os.getenv("EMAIL_REMETENTE")
    senha = os.getenv("EMAIL_SENHA")

    if not remetente or not senha:
        print("Credenciais de e-mail não configuradas.")
        return

    # Monta a estrutura do e-mail
    msg = MIMEMultipart()
    msg['From'] = remetente
    msg['To'] = email_destino
    msg['Subject'] = "Seu pagamento foi aprovado! 🎉 - Amazon Tech Energy"

    # Corpo do e-mail em HTML
    corpo_html = f"""
    <html>
      <body style="font-family: Arial, sans-serif; background-color: #f4f4f9; padding: 20px; color: #333333;">
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
          <div style="background-color: #0b3b24; padding: 30px; text-align: center; border-bottom: 4px solid #75d16c;">
            <img src="cid:eventlogo" alt="Amazon Tech Energy Logo" style="max-width: 150px; margin-bottom: 15px; display: inline-block;" />
            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">2º Amazon Tech Energy</h1>
            <p style="color: #75d16c; font-size: 16px; margin-top: 10px; font-weight: bold;">Inscrição Confirmada! 🎉</p>
          </div>
          
          <div style="padding: 30px;">
            <p style="font-size: 16px; line-height: 1.6; color: #333333;">Olá {nome_cliente},</p>
            <p style="font-size: 16px; line-height: 1.6; color: #333333;">É um imenso prazer ter você conosco! O seu pagamento foi aprovado e sua vaga para o maior debate sobre o horizonte energético do Brasil está garantida.</p>
            
            <div style="background-color: #f9f9f9; border-left: 4px solid #75d16c; padding: 15px; margin: 25px 0;">
              <p style="margin: 5px 0; color: #333333;"><strong>ID do Pedido:</strong> {id_pagamento}</p>
            </div>
            
            <h3 style="color: #1a1a1a; margin-top: 30px;">📅 Detalhes do Evento</h3>
            <ul style="list-style: none; padding: 0; font-size: 16px; line-height: 1.8; color: #333333;">
              <li><strong style="color: #1a1a1a;">Data:</strong> 15 a 17 de setembro</li>
              <li><strong style="color: #1a1a1a;">Local:</strong> Casa de Cultura, Salinópolis-PA</li>
            </ul>
            
            <p style="font-size: 16px; line-height: 1.6; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eeeeee; color: #333333;">
              📍 <strong style="color: #1a1a1a;">Atenção:</strong> Por favor, guarde este e-mail. Ele é a sua comprovação oficial de inscrição para acesso ao evento.
            </p>
          </div>
          
          <div style="background-color: #f4f4f9; padding: 20px; text-align: center; color: #777777; font-size: 12px; border-top: 1px solid #eeeeee;">
            <p>Nos vemos no evento!</p>
            <p><strong style="color: #333333;">Equipe Amazon Tech Energy</strong></p>
          </div>
        </div>
      </body>
    </html>
    """
    msg.attach(MIMEText(corpo_html, 'html'))

    # Anexa o logo
    logo_path = os.path.join(os.path.dirname(__file__), "..", "src", "assets", "brand", "event-logo.png")
    if os.path.exists(logo_path):
        try:
            with open(logo_path, 'rb') as img_file:
                logo_img = MIMEImage(img_file.read())
                logo_img.add_header('Content-ID', '<eventlogo>')
                msg.attach(logo_img)
        except Exception as e:
            print(f"Erro ao anexar logo: {e}")
    else:
        print("Logo não encontrada no caminho:", logo_path)

    # Conecta ao servidor e envia
    try:
        # Usando o SMTP do Gmail como exemplo (porta 465 para SSL)
        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as server:
            server.login(remetente, senha)
            server.send_message(msg)
        print(f"E-mail de confirmação enviado para {email_destino}")
    except Exception as e:
        print(f"Erro ao enviar o e-mail: {e}")

import urllib.request
import json

def salvar_na_planilha(id_pagamento: str, nome: str, email: str, cpf: str, telefone: str, perfil: str):
    try:
        load_dotenv(override=True)
        webhook_url = os.getenv("APPS_SCRIPT_WEBHOOK_URL")
        if not webhook_url:
            print("Planilha: APPS_SCRIPT_WEBHOOK_URL não configurado no .env.")
            return

        agora = datetime.now().strftime("%d/%m/%Y %H:%M:%S")

        payload = {
            "data_hora": agora,
            "id_pagamento": str(id_pagamento),
            "nome": nome,
            "email": email,
            "cpf": cpf,
            "telefone": telefone,
            "perfil": perfil
        }

        # Usando urllib.request para manter o método POST após o redirect 302 do Google
        data_bytes = json.dumps(payload).encode('utf-8')
        req = urllib.request.Request(webhook_url, data=data_bytes, headers={'Content-Type': 'application/json'})
        with urllib.request.urlopen(req, timeout=10) as response:
            res_text = response.read().decode('utf-8')
            print(f"Planilha: Inscrição de {nome} salva com sucesso via Webhook! Resposta: {res_text}")
    except Exception as e:
        print(f"Erro ao salvar na planilha via Webhook: {e}")

@app.post("/api/criar-pagamento-pix")
async def criar_pagamento(data: CheckoutData):
    # Força a leitura atualizada do arquivo .env em cada requisição
    load_dotenv(override=True)
    token = os.getenv("MP_ACCESS_TOKEN")
    print(f"DEBUG: Endpoint acessado. Token lido: {token[:12]}...{token[-5:]}" if token else "DEBUG: Token VAZIO!")
    
    sdk_local = mercadopago.SDK(token)
    
    payment_data = {
        "transaction_amount": data.valor,
        "description": f"Inscrição Amazon Tech - Perfil {data.perfil.capitalize()}",
        "payment_method_id": "pix",
        "payer": {
            "email": data.email,
            "first_name": data.nome,
            "identification": {
                "type": "CPF",
                "number": data.cpf.replace(".", "").replace("-", "")
            }
        },
        "metadata": {
            "nome_pagador": data.nome
        }
    }

    # Faz a requisição para a API do Mercado Pago
    print("DEBUG: payment_data to be sent:", payment_data)
    result = sdk_local.payment().create(payment_data)
    print("MERCADO PAGO RESULT:", result)
    payment = result.get("response", {})

    if result.get("status") in (200, 201):
        id_pag = str(payment.get("id"))
        dados_inscritos[id_pag] = {
            "nome": data.nome,
            "email": data.email,
            "cpf": data.cpf,
            "telefone": data.telefone,
            "perfil": data.perfil
        }
        
        transaction_data = payment.get("point_of_interaction", {}).get("transaction_data", {})
        
        return {
            "id_pagamento": payment.get("id"),
            "qr_code_base64": transaction_data.get("qr_code_base64"),
            "qr_code_copia_cola": transaction_data.get("qr_code"),
            "status": payment.get("status")
        }
    else:
        # Se algo der errado, retorna o erro do Mercado Pago
        raise HTTPException(status_code=400, detail="Falha ao processar pagamento com o Mercado Pago")

pagamentos_processados = set()
dados_inscritos = {}

@app.get("/api/status-pagamento/{payment_id}")
async def verificar_status(payment_id: str, background_tasks: BackgroundTasks):
    load_dotenv(override=True)
    token = os.getenv("MP_ACCESS_TOKEN")
    sdk_local = mercadopago.SDK(token)
    
    result = sdk_local.payment().get(payment_id)
    payment_info = result.get("response", {})
    status = payment_info.get("status", "pending")
    
    if status == "approved" and payment_id not in pagamentos_processados:
        pagamentos_processados.add(payment_id)
        
        # Puxa os dados reais armazenados localmente
        dados = dados_inscritos.get(str(payment_id))
        
        if not dados:
            email_mp = payment_info.get("payer", {}).get("email", "")
            email_valido = email_mp if "@" in email_mp else ""
            dados = {
                "nome": payment_info.get("metadata", {}).get("nome_pagador") or payment_info.get("payer", {}).get("first_name", ""),
                "email": email_valido,
                "cpf": payment_info.get("metadata", {}).get("cpf_pagador", ""),
                "telefone": payment_info.get("metadata", {}).get("telefone_pagador", ""),
                "perfil": payment_info.get("metadata", {}).get("perfil_pagador", "")
            }
            
        if dados.get("email") and "@" in dados["email"]:
            print(f"Status Polling: Pagamento {payment_id} aprovado para {dados['nome']} ({dados['email']})! Disparando e-mail e planilha...")
            background_tasks.add_task(enviar_email_confirmacao, dados["email"], str(payment_id), dados["nome"])
            background_tasks.add_task(salvar_na_planilha, str(payment_id), dados["nome"], dados["email"], dados["cpf"], dados["telefone"], dados["perfil"])
        else:
            print(f"Aviso: Pagamento {payment_id} aprovado, mas o e-mail do comprador era inválido/mascarado.")

    return {"status": status}

@app.post("/api/criar-pagamento-cartao")
async def criar_pagamento_cartao(data: CheckoutDataCartao, background_tasks: BackgroundTasks):
    load_dotenv(override=True)
    token = os.getenv("MP_ACCESS_TOKEN")
    sdk_local = mercadopago.SDK(token)
    
    payment_data = {
        "transaction_amount": data.transaction_amount,
        "token": data.token,
        "description": "Inscrição Amazon Tech - Cartão de Crédito",
        "installments": data.installments,
        "payment_method_id": data.payment_method_id,
        "payer": data.payer
    }
    
    if data.issuer_id:
        payment_data["issuer_id"] = data.issuer_id

    if data.metadata:
        payment_data["metadata"] = {k: str(v) for k, v in data.metadata.items() if v is not None}

    print("DEBUG CARTAO: payment_data to be sent:", payment_data)
    result = sdk_local.payment().create(payment_data)
    print("MERCADO PAGO CARTAO RESULT:", result)
    
    if result.get("status") in (200, 201):
        payment_status = result.get("response", {}).get("status")
        status_detail = result.get("response", {}).get("status_detail")
        id_pagamento = result.get("response", {}).get("id")
        
        meta = data.metadata or {}
        id_str = str(id_pagamento)
        dados_inscritos[id_str] = {
            "nome": meta.get("nome_pagador") or data.payer.get("first_name", ""),
            "email": meta.get("email_pagador") or data.payer.get("email", ""),
            "cpf": meta.get("cpf_pagador", ""),
            "telefone": meta.get("telefone_pagador", ""),
            "perfil": meta.get("perfil_pagador", "")
        }
        
        if payment_status == "approved":
            dados = dados_inscritos[id_str]
            if dados.get("email") and "@" in dados["email"]:
                background_tasks.add_task(enviar_email_confirmacao, dados["email"], id_str, dados["nome"])
                background_tasks.add_task(salvar_na_planilha, id_str, dados["nome"], dados["email"], dados["cpf"], dados["telefone"], dados["perfil"])
                
        return {"status": payment_status, "status_detail": status_detail, "id": id_pagamento}
    else:
        # Se falhar logo na criação (dados muito inválidos)
        msg_erro = result.get("response", {}).get("message", "Erro desconhecido")
        raise HTTPException(status_code=400, detail=f"Falha na API: {msg_erro}")

@app.post("/webhook/mercadopago")
async def webhook_mercadopago(request: Request, background_tasks: BackgroundTasks):
    # Pega os dados enviados pelo Mercado Pago na query ou no body
    data = await request.json()
    action = data.get("action")
    
    # Verifica se a notificação é sobre um pagamento criado/atualizado
    if action == "payment.created" or action == "payment.updated":
        payment_id = data.get("data", {}).get("id")
        
        if payment_id:
            # Busca o status atualizado do pagamento direto na API do Mercado Pago
            result = sdk.payment().get(payment_id)
            payment_info = result.get("response", {})
            
            status = payment_info.get("status")
            pid_str = str(payment_id)
            
            if status == "approved" and pid_str not in pagamentos_processados:
                pagamentos_processados.add(pid_str)
                
                dados = dados_inscritos.get(pid_str)
                if not dados:
                    email_mp = payment_info.get("payer", {}).get("email", "")
                    email_valido = email_mp if "@" in email_mp else ""
                    dados = {
                        "nome": payment_info.get("metadata", {}).get("nome_pagador") or payment_info.get("payer", {}).get("first_name", ""),
                        "email": email_valido,
                        "cpf": payment_info.get("metadata", {}).get("cpf_pagador", ""),
                        "telefone": payment_info.get("metadata", {}).get("telefone_pagador", ""),
                        "perfil": payment_info.get("metadata", {}).get("perfil_pagador", "")
                    }
                
                if dados.get("email") and "@" in dados["email"]:
                    print(f"Webhook: Pagamento {payment_id} aprovado para {dados['nome']} ({dados['email']})! Disparando e-mail e planilha...")
                    background_tasks.add_task(enviar_email_confirmacao, dados["email"], pid_str, dados["nome"])
                    background_tasks.add_task(salvar_na_planilha, pid_str, dados["nome"], dados["email"], dados["cpf"], dados["telefone"], dados["perfil"])

    # Sempre retorne 200 OK rapidamente para o Mercado Pago
    return {"status": "recebido"}
