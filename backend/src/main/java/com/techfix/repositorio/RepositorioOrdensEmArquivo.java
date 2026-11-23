package com.techfix.repositorio;

import com.techfix.dominio.RegistroOrdem;
import com.techfix.dominio.RepositorioOrdens;
import com.techfix.dominio.StatusOrdemServico;
import com.techfix.dominio.TipoEquipamento;
import java.io.IOException;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.NoSuchFileException;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

/** Texto UTF-8: um registro por linha, campos separados por tabulação (TSV). */
public class RepositorioOrdensEmArquivo implements RepositorioOrdens {
    private final Path arquivo;

    public RepositorioOrdensEmArquivo(Path arquivo) {
        this.arquivo = Objects.requireNonNull(arquivo, "Arquivo deve ser informado").toAbsolutePath();
    }

    @Override
    public void salvar(RegistroOrdem registro) {
        Objects.requireNonNull(registro, "Registro deve ser informado");
        Path temporario = null;
        try {
            Files.createDirectories(arquivo.getParent());
            var registros = new ArrayList<>(listar());
            registros.add(registro);
            var conteudo = new StringBuilder();
            for (var item : registros) {
                conteudo.append(item.numero()).append('\t').append(escapar(item.cliente())).append('\t')
                    .append(item.equipamento()).append('\t').append(item.status()).append('\t')
                    .append(item.total().toPlainString()).append('\n');
            }
            temporario = Files.createTempFile(arquivo.getParent(), "ordens-", ".tmp");
            Files.writeString(temporario, conteudo, StandardCharsets.UTF_8);
            // A troca atômica evita publicar um arquivo parcialmente escrito.
            Files.move(temporario, arquivo, StandardCopyOption.ATOMIC_MOVE, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException erro) {
            if (temporario != null) {
                try {
                    Files.deleteIfExists(temporario);
                } catch (IOException limpeza) {
                    erro.addSuppressed(limpeza);
                }
            }
            throw new RepositorioException("Não foi possível gravar as ordens em " + arquivo + ". Verifique o caminho e as permissões e tente novamente.", erro);
        }
    }

    @Override
    public List<RegistroOrdem> listar() {
        List<String> linhas;
        try {
            linhas = Files.readAllLines(arquivo, StandardCharsets.UTF_8);
        } catch (NoSuchFileException arquivoAindaNaoCriado) {
            // Na primeira execução ainda não há histórico; outros erros não são ignorados.
            return List.of();
        } catch (IOException erro) {
            throw new RepositorioException("Não foi possível ler as ordens de " + arquivo + ". Verifique o caminho e as permissões e tente novamente.", erro);
        }
        var registros = new ArrayList<RegistroOrdem>();
        for (int i = 0; i < linhas.size(); i++) {
            try {
                String[] campos = linhas.get(i).split("\t", -1);
                if (campos.length != 5) {
                    throw new IllegalArgumentException("Esperados cinco campos separados por tabulação");
                }
                registros.add(new RegistroOrdem(Integer.parseInt(campos[0]), desescapar(campos[1]),
                    TipoEquipamento.valueOf(campos[2]), StatusOrdemServico.valueOf(campos[3]),
                    new BigDecimal(campos[4])));
            } catch (IllegalArgumentException erro) {
                throw new RepositorioException("Registro inválido na linha " + (i + 1) + " de " + arquivo + ". Corrija o arquivo ou restaure um backup antes de tentar novamente.",
                    new IOException("Formato de registro inválido", erro));
            }
        }
        return List.copyOf(registros);
    }

    private static String escapar(String texto) {
        return texto.replace("\\", "\\\\").replace("\t", "\\t")
            .replace("\n", "\\n").replace("\r", "\\r");
    }

    private static String desescapar(String texto) {
        var resultado = new StringBuilder();
        for (int i = 0; i < texto.length(); i++) {
            char caractere = texto.charAt(i);
            if (caractere == '\\') {
                if (++i == texto.length()) {
                    throw new IllegalArgumentException("Escape incompleto");
                }
                caractere = switch (texto.charAt(i)) {
                    case '\\' -> '\\';
                    case 't' -> '\t';
                    case 'n' -> '\n';
                    case 'r' -> '\r';
                    default -> throw new IllegalArgumentException("Escape desconhecido");
                };
            }
            resultado.append(caractere);
        }
        return resultado.toString();
    }
}
