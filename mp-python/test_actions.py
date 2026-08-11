import os
from dotenv import load_dotenv
from main import enviar_email_confirmacao, salvar_na_planilha

load_dotenv(override=True)
print("Enviando email...")
enviar_email_confirmacao("thiagoyeshua01@gmail.com", "172584292134", "Thiago Yeshua")
print("Salvando na planilha...")
salvar_na_planilha("172584292134", "Thiago Yeshua", "thiagoyeshua01@gmail.com", "06701630235", "91991326639", "graduando")
print("Fim.")
