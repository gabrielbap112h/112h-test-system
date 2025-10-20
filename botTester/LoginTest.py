# selenium_login_test.py
# Requisitos: pip install selenium webdriver-manager

import json
import time
import os
import shutil
from datetime import datetime
from urllib.parse import urlparse
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service as ChromeService
from selenium.webdriver.chrome.options import Options
# ---------- CONFIGURAÇÃO ----------
BASE_URL = "http://localhost:3001/#/login"
WRONG_EMAIL = "gabriel.wrongemail.com"
CORRECT_EMAIL = "gabriel@email.com"
PASSWORD = "senha123"
OUTPUT_JSON = "verificacoes_login.json"

# diretórios de saída — garantimos que existam
OUTPUT_DIR = os.path.join(os.getcwd(), "results")
os.makedirs(OUTPUT_DIR, exist_ok=True)

PUBLIC_DIR = os.path.join(os.getcwd(), "public")
os.makedirs(PUBLIC_DIR, exist_ok=True)

# tempo máximo para esperar navegação / elementos (segundos)
TIMEOUT = 12

# ---------- HELPERS ----------
def timestamp():
    return datetime.utcnow().isoformat() + "Z"

def fragment_from_url(url):
    parsed = urlparse(url)
    return parsed.fragment

def get_next_filename():
    """Gera nome sequencial tipo verificacoes_login_001.json"""
    i = 1
    while True:
        fname = os.path.join(OUTPUT_DIR, f"verificacoes_login_{i:03}.json")
        if not os.path.exists(fname):
            return fname
        i += 1

def log(msg):
    now = datetime.now().strftime("%H:%M:%S")
    print(f"[{now}] {msg}")

# ---------- INÍCIO ----------
results = []

chrome_options = Options()
# ❗ Remova a linha abaixo se quiser ver o navegador abrindo:
chrome_options.add_argument("--headless=new")
chrome_options.add_argument("--start-maximized")
chrome_options.add_argument("--disable-gpu")
chrome_options.add_argument("--no-sandbox")

driver = webdriver.Chrome(service=ChromeService(ChromeDriverManager().install()), options=chrome_options)

try:
    log("🚀 Iniciando teste de login")
    log(f"Abrindo página: {BASE_URL}")
    driver.get(BASE_URL)

    results.append({
        "time": timestamp(),
        "step": "abrir_login",
        "url_visitada": driver.current_url,
        "ok": True,
        "message": f"Acessou {BASE_URL}"
    })

    wait = WebDriverWait(driver, TIMEOUT)

    log("🔍 Aguardando campos de login aparecerem...")
    email_sel = (By.CSS_SELECTOR, 'input[type="email"]')
    pwd_sel = (By.CSS_SELECTOR, 'input[type="password"]')
    submit_sel = (By.CSS_SELECTOR, 'button[type="submit"], input[type="submit"]')

    wait.until(EC.presence_of_element_located(email_sel))
    wait.until(EC.presence_of_element_located(pwd_sel))
    wait.until(EC.element_to_be_clickable(submit_sel))
    log("✅ Campos de login encontrados.")

    def try_login(email, password, description):
        """Executa tentativa de login"""
        log(f"🧪 Tentando login: {description} ({email})")

        email_el = driver.find_element(*email_sel)
        pwd_el = driver.find_element(*pwd_sel)
        submit_el = driver.find_element(*submit_sel)

        email_el.clear()
        email_el.send_keys(email)
        pwd_el.clear()
        pwd_el.send_keys(password)
        log("📩 Credenciais preenchidas, enviando formulário...")
        submit_el.click()

        start_time = time.time()
        navigated_to_root = False
        current_url = driver.current_url
        last_frag = fragment_from_url(current_url)
        log(f"🔄 Aguardando mudança de fragmento (atual: {last_frag})...")

        try:
            WebDriverWait(driver, TIMEOUT).until(lambda d: fragment_from_url(d.current_url) != last_frag)
        except Exception:
            log("⚠️ Nenhuma mudança de fragmento detectada (timeout).")

        new_url = driver.current_url
        new_frag = fragment_from_url(new_url)
        log(f"📍 URL após tentativa: {new_url} (fragment: {new_frag})")

        if new_frag == "/" or (new_frag == "" and urlparse(new_url).path == "/"):
            navigated_to_root = True
        elif "login" not in new_frag and new_frag != "":
            navigated_to_root = True

        result = {
            "time": timestamp(),
            "step": description,
            "email_tentado": email,
            "password_used": "(omitted)",
            "current_url": new_url,
            "fragment": new_frag,
            "navegou_para_root_fragment": navigated_to_root
        }
        return result

    # 1️⃣ Login com email errado
    log("🚫 Testando login com email incorreto...")
    r_wrong = try_login(WRONG_EMAIL, PASSWORD, "login_com_email_errado")

    if r_wrong["navegou_para_root_fragment"]:
        r_wrong["ok"] = False
        r_wrong["message"] = "❌ Login com email errado redirecionou indevidamente para '/'."
    else:
        r_wrong["ok"] = True
        r_wrong["message"] = "✅ Login com email errado bloqueado corretamente."
    results.append(r_wrong)
    log(r_wrong["message"])

    # 2️⃣ Se necessário, recarregar login
    if "login" not in fragment_from_url(driver.current_url):
        log("🔁 Reabrindo tela de login após erro...")
        try:
            driver.get(BASE_URL)
            wait.until(EC.presence_of_element_located(email_sel))
            results.append({
                "time": timestamp(),
                "step": "reabrir_login_apos_erro",
                "ok": True,
                "message": "Reabriu a tela de login antes da segunda tentativa",
                "current_url": driver.current_url
            })
            log("✅ Tela de login recarregada com sucesso.")
        except Exception as e:
            results.append({
                "time": timestamp(),
                "step": "reabrir_login_apos_erro",
                "ok": False,
                "message": f"Falha ao reabrir login: {str(e)}",
                "current_url": driver.current_url
            })
            log("❌ Falha ao reabrir tela de login.")

    # 3️⃣ Login com credenciais corretas
    log("🔑 Testando login com credenciais corretas...")
    r_correct = try_login(CORRECT_EMAIL, PASSWORD, "login_com_credenciais_corretas")

    if r_correct["navegou_para_root_fragment"]:
        r_correct["ok"] = True
        r_correct["message"] = "✅ Login correto redirecionou para '/'."
    else:
        log("⏳ Esperando mais 1 segundo antes de verificar novamente...")
        time.sleep(1)
        cur_frag = fragment_from_url(driver.current_url)
        cur_url = driver.current_url
        if cur_frag == "/":
            r_correct["ok"] = True
            r_correct["message"] = "✅ Após aguardar, fragment é '/'. Login bem-sucedido."
        else:
            r_correct["ok"] = False
            r_correct["message"] = "❌ Não houve navegação para '/' após tentativa correta."
        r_correct["current_url_after_wait"] = cur_url
        r_correct["fragment_after_wait"] = cur_frag
    results.append(r_correct)
    log(r_correct["message"])

    # 4️⃣ Resultado final
    final = {
        "time": timestamp(),
        "step": "final",
        "ok": r_correct["ok"],
        "message": "🏁 Teste finalizado. Veja passos anteriores para detalhes."
    }
    results.append(final)

    # Salvar JSON numerado
    output_file = get_next_filename()
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump({"executado_em": timestamp(), "steps": results}, f, ensure_ascii=False, indent=2)

    log(f"💾 Resultado salvo em: {output_file}")

    # Copiar automaticamente para a pasta public do React
    try:
        public_json = os.path.join(PUBLIC_DIR, "verificacoes_login.json")
        shutil.copyfile(output_file, public_json)
        log(f"📂 Copiado também para: {public_json}")
    except Exception as e:
        log(f"⚠️ Falha ao copiar para public/: {e}")

    # Exibir resumo final
    log("📋 Resumo das etapas:")
    for s in results:
        log(f"  - {s['step']} | ok={s.get('ok')} | {s.get('message')}")

finally:
    time.sleep(0.6)
    driver.quit()
    log("🧹 Navegador encerrado.")