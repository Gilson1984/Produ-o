
from fastapi import FastAPI, Request
from pydantic import BaseModel
from datetime import datetime

app = FastAPI()

TEMPO_TURNO_MINUTOS = 720
PRODUCAO_POR_MINUTO = 90

paradas = []

class Parada(BaseModel):
    minutos: int

@app.post("/paradas")
def registrar_parada(p: Parada):
    paradas.append({
        "minutos": p.minutos,
        "timestamp": datetime.now().isoformat()
    })
    return {"status": "ok"}

@app.get("/turno")
def turno_status():
    tempo_parado = sum([p["minutos"] for p in paradas])
    tempo_disponivel = max(TEMPO_TURNO_MINUTOS - tempo_parado, 0)
    producao_estimada = tempo_disponivel * PRODUCAO_POR_MINUTO
    probabilidade = round((tempo_disponivel / TEMPO_TURNO_MINUTOS) * 100, 2)
    return {
        "tempo_parado": tempo_parado,
        "producao_estimada": producao_estimada,
        "probabilidade": probabilidade
    }

@app.get("/historico")
def historico_paradas():
    return paradas
