export class Produto {
    constructor(
        public id: number|null,
        public nome: string,
        public preco: number
    ) { }
}

export interface ProdutoFormProps {
    produtoExistente?: Produto
}
