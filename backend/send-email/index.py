import json
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


def handler(event: dict, context) -> dict:
    """Отправка заявки с сайта на почту info@kdfu.ru"""

    cors_headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    }

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": cors_headers, "body": ""}

    def resp(status, data):
        return {"statusCode": status, "headers": cors_headers, "body": data}

    raw_body = event.get("body") or "{}"
    print(f"[send-email] raw body type={type(raw_body).__name__} value={repr(raw_body)[:200]}")
    try:
        body = json.loads(raw_body) if isinstance(raw_body, str) else raw_body
    except Exception as ex:
        print(f"[send-email] JSON parse error: {ex}")
        return resp(400, {"error": "Invalid JSON"})

    form_type = body.get("type", "contact")
    name = body.get("name", "").strip()
    phone = body.get("phone", "").strip()
    email = body.get("email", "").strip()
    company = body.get("company", "").strip()
    comment = body.get("comment", "").strip()

    if not name or not phone:
        return resp(400, {"error": "Имя и телефон обязательны"})

    type_labels = {
        "offer": "Запрос коммерческого предложения",
        "sample": "Заказ образцов продукции",
        "callback": "Обратный звонок",
        "contact": "Сообщение с сайта",
    }
    subject = type_labels.get(form_type, "Новая заявка с сайта КФУ")

    lines = [
        f"<h2 style='color:#1e3a5f;font-family:Arial'>📋 {subject}</h2>",
        "<table style='border-collapse:collapse;font-family:Arial;font-size:14px'>",
        f"<tr><td style='padding:8px 16px 8px 0;color:#666;white-space:nowrap'><b>Имя:</b></td><td style='padding:8px 0'>{name}</td></tr>",
        f"<tr><td style='padding:8px 16px 8px 0;color:#666'><b>Телефон:</b></td><td style='padding:8px 0'>{phone}</td></tr>",
    ]
    if email:
        lines.append(f"<tr><td style='padding:8px 16px 8px 0;color:#666'><b>Email:</b></td><td style='padding:8px 0'>{email}</td></tr>")
    if company:
        lines.append(f"<tr><td style='padding:8px 16px 8px 0;color:#666'><b>Компания:</b></td><td style='padding:8px 0'>{company}</td></tr>")
    if comment:
        lines.append(f"<tr><td style='padding:8px 16px 8px 0;color:#666;vertical-align:top'><b>Сообщение:</b></td><td style='padding:8px 0'>{comment}</td></tr>")
    lines.append("</table>")
    lines.append("<hr style='margin:20px 0;border:none;border-top:1px solid #eee'>")
    lines.append("<p style='color:#aaa;font-size:12px;font-family:Arial'>Заявка получена с сайта kdfu.ru</p>")

    html_body = "\n".join(lines)

    smtp_host = os.environ.get("SMTP_HOST", "")
    smtp_port = int(os.environ.get("SMTP_PORT", "465"))
    smtp_user = os.environ.get("SMTP_USER", "")
    smtp_pass = os.environ.get("SMTP_PASS", "")
    to_email = "info@kdfu.ru"

    print(f"[send-email] type={form_type} name={name} phone={phone}")
    print(f"[send-email] SMTP host={smtp_host!r} user={smtp_user!r} pass_set={bool(smtp_pass)}")

    if not smtp_host or not smtp_user or not smtp_pass:
        print("[send-email] ERROR: SMTP secrets not configured")
        return resp(500, {"error": "SMTP не настроен — заполните секреты SMTP_HOST, SMTP_USER, SMTP_PASS"})

    msg = MIMEMultipart("alternative")
    msg["Subject"] = f"[Сайт КФУ] {subject} — {name}"
    msg["From"] = smtp_user
    msg["To"] = to_email
    msg["Reply-To"] = email if email else smtp_user
    msg.attach(MIMEText(html_body, "html", "utf-8"))

    try:
        print(f"[send-email] connecting to {smtp_host}:{smtp_port}")
        with smtplib.SMTP_SSL(smtp_host, smtp_port) as server:
            server.login(smtp_user, smtp_pass)
            server.sendmail(smtp_user, [to_email], msg.as_string())
        print("[send-email] sent OK")
    except Exception as e:
        print(f"[send-email] SMTP ERROR: {e}")
        return resp(500, {"error": f"Ошибка отправки: {str(e)}"})

    return resp(200, {"ok": True})