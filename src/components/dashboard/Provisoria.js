import React, { useState } from "react";
import BaseCard from "../baseCard/BaseCard";
import { Button } from "@mui/material";
import FeatherIcon from "feather-icons-react";
import { changeTitleAlert } from "../../store/ducks/Layout";
import { useDispatch } from "react-redux";
import { checkOverdueSales } from "../../store/fetchActions/sale";
import ConfirmDialog from "../confirmDialog";
import AlertModal from "../messagesModal";

export default function Provisoria() {

  const dispatch = useDispatch();
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: 'Deseja realmente excluir',
    subTitle: 'Esta ação não poderá ser desfeita',
  });

  const checkSales = async () => {
    setConfirmDialog({ ...confirmDialog, isOpen: true, title: `Deseja Realmente executar esta ação?`, confirm: checkOverdueSales() })
    dispatch(changeTitleAlert(`Ação realizada com sucesso!`))
  }

  return (
    <BaseCard title="SysVendas">
      
      <AlertModal />

      <Button title="Pesquisar Vendas Vencidas" onClick={checkSales} color="success" size="medium" variant="contained">
        Buscar clientes com compras vencidas
        <FeatherIcon icon="lock" width="45" height="45" />
      </Button>


      <h1>Novidades...</h1>

      <h2>#Criado Botão para bloqueio de clientes com vendas vencidas</h2>
      <h4>... 24/06/2023</h4>
      
      <h4>#Criado filtro de clientes bloqueados</h4>
      <h6>... 24/06/2023</h6>

      <h4>#Inserido bloqueio de venda para clientes sem limite ou cliente bloqueado</h4>
      <h6>... 17/06/2023</h6>

      <h4>#Inserido componente de bloqueio de cliente em editar cliente</h4>
      <h6>... 16/06/2023</h6>

      <h4>#Inserido vendedor, no momento da venda, e na nota!</h4>
      <h6>... 04/06/2023</h6>

      <h4>#Criado botão para impressão de vendas por data!</h4>
      <h6>... 04/06/2023</h6>

      <h4>#Criado cadastro de endereço!</h4>
      <h6>... 21/05/2023</h6>

      <h4>#Criado cadastro e finalização de orçamento!</h4>
      <h6>... 21/05/2023</h6>

      <h4>#Criado pesquisa por tipo, como vendas a vista, a prazo, a prazo pendentes e pagas!</h4>
      <h6>... 20/05/2023</h6>

      <h4>#Criado botão de exibição de todas as vendas por cliente, filtrando por a vista, a prazo, a prazo pagas e pendentes!</h4>
      <h6>... 20/05/2023</h6>

      <h4>#Criado pesquisa de clientes e vendas por código!</h4>
      <h6>... 19/05/2023</h6>

      <h4>#Criado botão e campo de observação por item no carrinho!</h4>
      <h6>... 06/05/2023</h6>

      <h4>#Criado botao para alterar quantidade do item no carrinho</h4>
      <h6>... 06/05/2023</h6>

      <h4>#Inserido logomarga, CNPJ e Telefone no recibo de venda!</h4>
      <h6>... 16/04/2023</h6>

      <h4>#Retirado disconto da venda a prazo</h4>
      <h6>... 10/04/2023</h6>

      <h4>#Inserido informações do cliente no relatorio de venda, quando venda for a prazo</h4>
      <h6>... 08/04/2023</h6>

      <h4>#Redimensionado o tamanho do relatório de vendas para impressão!</h4>
      <h6>... 09/10/2022</h6>

      <h4>#Criado função de imprimir relatorio de vendas</h4>
      <h6>... 27/07/2022</h6>

      <ConfirmDialog
        confirmDialog={confirmDialog}
        setConfirmDialog={setConfirmDialog}
        isAuthenticated={true}
      />
    </BaseCard>
  );
};

