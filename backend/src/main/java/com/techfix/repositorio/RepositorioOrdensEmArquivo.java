package com.techfix.repositorio;

import com.techfix.dominio.RegistroOrdem;
import com.techfix.dominio.RepositorioOrdens;
import com.techfix.dominio.StatusOrdemServico;
import com.techfix.dominio.TipoEquipamento;
import java.io.IOException;
import java.io.UncheckedIOException;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.NoSuchFileException;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;
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
        String linha = registro.numero() + "\t" + escapar(registro.cliente()) + "\t"
            + registro.equipamento() + "\t" + registro.status() + "\t"
            + registro.total().toPlainString() + "\n";
        try {
            Files.createDirectories(arquivo.getParent());
            Files.writeString(arquivo, linha, StandardCharsets.UTF_8,
                StandardOpenOption.CREATE, StandardOpenOption.APPEND);
        } catch (IOException erro) {
            throw new UncheckedIOException("Não foi possível gravar as ordens em " + arquivo, erro);
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
            throw new UncheckedIOException("Não foi possível ler as ordens de " + arquivo, erro);
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
                throw new UncheckedIOException("Registro inválido na linha " + (i + 1) + " de " + arquivo,
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
