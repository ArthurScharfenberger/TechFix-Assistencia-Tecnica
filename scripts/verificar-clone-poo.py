"""Valida o código em clone separado com cache Maven inicialmente vazio.

Uso: python scripts/verificar-clone-poo.py caminho-do-clone
O clone deve já existir. Não apaga dados ou modifica arquivos versionados.
"""
from pathlib import Path
import os
import shutil
import subprocess
import sys
import tempfile

root=Path(__file__).resolve().parents[1]
clone=Path(sys.argv[1]).resolve()
out=root/'docs/poo/atividade-14'
env=dict(os.environ);env['MAVEN_OPTS']=env.get('MAVEN_OPTS','')+' -Dfile.encoding=UTF-8'
sha=subprocess.check_output(['git','rev-parse','HEAD'],cwd=clone).decode().strip()
with tempfile.TemporaryDirectory(prefix='techfix-maven-limpo-') as cache:
    args=[shutil.which('mvn'),'-B','-Dmaven.repo.local='+cache,'clean','test']
    result=subprocess.run(args,cwd=clone/'backend',env=env,stdout=subprocess.PIPE,stderr=subprocess.STDOUT)
    log=result.stdout.decode('utf-8',errors='replace')
    (out/'clone-limpo-testes.txt').write_text('Clone: '+str(clone)+'\nCommit: '+sha+'\nCache Maven vazio criado nesta execução.\n'+log,encoding='utf-8')
    print('\n'.join(log.splitlines()[-18:]))
    if result.returncode:sys.exit(result.returncode)
    cmd=['java','-Dfile.encoding=UTF-8','-cp','target/classes','com.techfix.app.Main']
    outputs=[subprocess.check_output(cmd,cwd=clone/'backend').decode('utf-8') for _ in range(2)]
    assert 'Ordens salvas: 1' in outputs[0] and 'Ordens salvas: 2' in outputs[1]
    (out/'clone-limpo-execucao.txt').write_text('Commit: '+sha+'\n\n'+'\nSEGUNDA EXECUÇÃO\n'.join(outputs),encoding='utf-8')
    print('Clone limpo: testes aprovados e duas execuções preservam o histórico.')
