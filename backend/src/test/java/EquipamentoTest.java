import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;

class EquipamentoTest {

    @Test
    void notebookDeveEspecializarDescricaoDoAtendimento() {
        Equipamento equipamento = new Notebook("Dell", "Não liga", 16);

        assertTrue(equipamento.descreverAtendimento().contains("notebook com 16 GB de RAM"));
    }

    @Test
    void celularDeveEspecializarDescricaoDoAtendimento() {
        Equipamento equipamento = new Celular("Samsung", "Tela quebrada", true);

        assertTrue(equipamento.descreverAtendimento().contains("celular com dual chip"));
    }

    @Test
    void subclassesDevemHerdarDadosComuns() {
        Equipamento notebook = new Notebook("Lenovo", "Superaquecimento", 8);
        Equipamento celular = new Celular("Motorola", "Não carrega", false);

        assertEquals("Lenovo", notebook.getMarca());
        assertEquals("Não carrega", celular.getDefeito());
    }

    @Test
    void subclassesDevemHerdarValidacaoDeMarca() {
        assertThrows(
            IllegalArgumentException.class,
            () -> new Notebook("", "Não liga", 16)
        );
        assertThrows(
            IllegalArgumentException.class,
            () -> new Celular(" ", "Tela quebrada", true)
        );
    }
}
