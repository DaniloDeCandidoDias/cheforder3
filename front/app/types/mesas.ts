export class Mesa {
    constructor(
        public id: number|null,
        public numero: number,
        public status: string
    ) { }
}

export interface MesaFormProps {
    mesaExistente?: Mesa
}
