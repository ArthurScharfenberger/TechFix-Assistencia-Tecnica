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
    void desktopDeveEspecializarDescricaoDoAtendimento() {
        Equipamento equipamento = new Desktop("Dell", "Sem imagem", true);

        assertTrue(equipamento.descreverAtendimento().contains("desktop com placa de vídeo dedicada"));
    }

    @Test
    void subclassesDevemHerdarDadosComuns() {
        Equipamento notebook = new Notebook("Lenovo", "Superaquecimento", 8);
        Equipamento desktop = new Desktop("HP", "Não liga", false);

        assertEquals("Lenovo", notebook.getMarca());
        assertEquals("Não liga", desktop.getDefeito());
    }

    @Test
    void subclassesDevemHerdarValidacaoDeMarca() {
        assertThrows(
            IllegalArgumentException.class,
            () -> new Notebook("", "Não liga", 16)
        );
        assertThrows(
            IllegalArgumentException.class,
            () -> new Desktop(" ", "Sem imagem", true)
        );
    }
}
