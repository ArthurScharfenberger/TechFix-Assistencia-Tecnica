"""Executa Maven e grava evidência UTF-8; saída e código de retorno são reais."""
import os
from pathlib import Path
import shutil
import subprocess
import sys

root = Path(__file__).resolve().parents[1]
destino = root / sys.argv[1]
destino.parent.mkdir(parents=True, exist_ok=True)
env = dict(os.environ)
env['MAVEN_OPTS'] = env.get('MAVEN_OPTS', '') + ' -Dfile.encoding=UTF-8'
args = [shutil.which('mvn'), '-B', '-f', 'backend/pom.xml'] + (sys.argv[2:] or ['clean', 'test'])
result = subprocess.run(args, cwd=root, env=env, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
texto = result.stdout.decode('utf-8', errors='replace')
destino.write_text(texto, encoding='utf-8')
print('\n'.join(texto.splitlines()[-22:]))
sys.exit(result.returncode)
