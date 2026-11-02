import { prisma } from "../lib/prisma";
import { AppError } from "../errors/AppError";
import { CadastroInstituicao, AtualizarInstituicao } from "../schemas/instituicao.schema";

function traduzirErroPrisma(error: unknown): never {
    const code = (error as { code?: string })?.code;
    if (code === "P2002") throw new AppError("Já existe uma instituição com este CNPJ.", 409);
    if (code === "P2003") throw new AppError("Há cursos vinculados a esta instituição. Remova-os antes de excluir.", 409);
    if (code === "P2025") throw new AppError("Instituição não encontrada.", 404);
    throw error;
}

export async function criarInstituicao(data: CadastroInstituicao) {
    try {
        return await prisma.instituicao.create({ data });
    } catch (error) {
        traduzirErroPrisma(error);
    }
}

export async function atualizarInstituicao(
    id: string, 
    data: CadastroInstituicao
) {
    try {
        return await prisma.instituicao.update({ where: { id }, data });
    } catch (error) {
        traduzirErroPrisma(error);
    }
}

export async function listarInstituicoes() {
    return await prisma.instituicao.findMany({
        orderBy: [{ nome: "asc" }, { campus: "asc" }],
        select: {
            id: true,
            nome: true,
            cidade: true,
            campus: true,
            cnpj: true,
        }
    });
}

export async function buscarInstituicao(id: string) {
    return await prisma.instituicao.findUnique({
        where: { id },
        select: {
            nome: true,
            cidade: true,
            campus: true,
            cnpj: true,
        }
    });
}

export async function excluir(id: string) {
    try {
        return await prisma.instituicao.delete({ where: { id } });
    } catch (error) {
        traduzirErroPrisma(error);
    }
}