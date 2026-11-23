package com.techfix.repositorio;

import com.techfix.dominio.RegistroOrdem;
import com.techfix.dominio.StatusOrdemServico;
import com.techfix.dominio.TipoEquipamento;
import java.math.BigDecimal;

/** Formato puro: não acessa disco e não decide regras de negócio. */
final class FormatoRegistroTsv {
    private FormatoRegistroTsv() { }

    static String codificar(RegistroOrdem registro) {
        return registro.numero() + "\t" + escapar(registro.cliente()) + "\t"
            + registro.equipamento() + "\t" + registro.status() + "\t"
            + registro.total().toPlainString() + "\n";
    }

    static RegistroOrdem decodificar(String linha) {
        String[] campos = linha.split("\t", -1);
        if (campos.length != 5) {
            throw new IllegalArgumentException("Esperados cinco campos separados por tabulação");
        }
        return new RegistroOrdem(Integer.parseInt(campos[0]), desescapar(campos[1]),
            TipoEquipamento.valueOf(campos[2]), StatusOrdemServico.valueOf(campos[3]),
            new BigDecimal(campos[4]));
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
