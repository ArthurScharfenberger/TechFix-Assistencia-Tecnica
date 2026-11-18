"""Confere links locais e IDs da documentação viva da entrega AS.

Uso: python scripts/verificar_dossie_a15.py
Não substitui a revisão semântica nem executa os testes CT de Processos.
"""
import re
from pathlib import Path
from urllib.parse import unquote

ROOT = Path(__file__).resolve().parent.parent
files = [ROOT / 'README.md', ROOT / 'docs/README.md']
for folder in ['01-contexto', '02-requisitos', '03-planejamento', '04-modelagem', '05-qualidade', '06-evolucao']:
    files.extend((ROOT / 'docs' / folder).glob('*.md'))
files.extend((ROOT / 'docs/processos/dossie').glob('*.md'))
errors = []
links = 0
for path in files:
    source = path.read_text(encoding='utf-8')
    for target in re.findall(r'\[[^\]]*\]\(([^)]+)\)', source):
        if re.match(r'^[a-z]+://', target) or target.startswith('#'):
            continue
        target = unquote(target.split('#')[0])
        links += 1
        if not (path.parent / target).exists():
            errors.append(f'{path.relative_to(ROOT)}: link inexistente {target}')

def read(path):
    return (ROOT / path).read_text(encoding='utf-8')

requirements = read('docs/processos/dossie/requisitos.md')
tests = read('docs/processos/05-qualidade/A13-estrategia-e-casos-de-teste.md')
backlog = read('docs/processos/dossie/backlog.md')
matrix = read('docs/processos/dossie/matriz-rastreabilidade.md')
a15 = read('docs/06-evolucao/A15-dossie-e-plano-evolucao.md')
for prefix, count, source in [('CA', 19, requirements), ('CT', 22, tests), ('A8R', 12, backlog), ('DIV', 8, a15)]:
    found = set(re.findall(r'\|\s*(' + prefix + r'\d{2})\s*\|', source))
    expected = {f'{prefix}{i:02}' for i in range(1, count + 1)}
    if found != expected:
        errors.append(f'{prefix}: faltam {sorted(expected-found)}, extras {sorted(found-expected)}')
for prefix in ['CA', 'CT', 'A8R']:
    for start, end in re.findall(prefix + r'(\d{2})[–-](?:' + prefix + r')?(\d{2})', matrix):
        matrix += ' ' + ' '.join(f'{prefix}{i:02}' for i in range(int(start), int(end) + 1))
for prefix, count in [('CA', 19), ('CT', 22), ('A8R', 12)]:
    found = set(re.findall(prefix + r'\d{2}', matrix))
    expected = {f'{prefix}{i:02}' for i in range(1, count + 1)}
    if not expected.issubset(found):
        errors.append(f'Matriz sem referência a {sorted(expected-found)}')
for name in ['A15-Ficha-Entrega-Final.docx', 'A15-Ficha-Entrega-Final.pdf']:
    if not (ROOT / 'docs/06-evolucao' / name).is_file():
        errors.append(f'Ficha ausente: {name}')
if errors:
    raise SystemExit('\n'.join(errors))
print(f'OK: {len(files)} arquivos, {links} links locais; CA01–CA19, CT01–CT22, A8R01–A8R12 e DIV01–DIV08 consistentes.')
