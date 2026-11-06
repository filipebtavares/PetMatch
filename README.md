# PetMatch - Sistema de Adoção de Animais

[![CI - Push](https://github.com/Rafaell-dev/PetMatch/actions/workflows/ci-push.yml/badge.svg)](https://github.com/Rafaell-dev/PetMatch/actions/workflows/ci-push.yml)
[![DockerHub](https://badgen.net/badge/icon/docker?icon=docker&label=DockerHub&color=blue)](https://hub.docker.com/r/filipebeniciodev/petmatch-backend)
[![Docker Image Size](https://badgen.net/docker/size/filipebeniciodev/petmatch-backend?icon=docker)](https://hub.docker.com/r/filipebeniciodev/petmatch-backend)

O **Sistema de Adoção de Animais** é uma plataforma projetada para listar e gerenciar animais disponíveis para adoção, facilitando o encontro de um novo lar para animais de estimação.

## Como Executar o Projeto

1. Instale as dependências:
   ```bash
   npm install
   ```

2. Execute o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

O servidor iniciará em [http://localhost:8080](http://localhost:8080).

---

## Docker

A imagem Docker oficial da aplicação está hospedada e disponível publicamente no Docker Hub:

* **Link no Docker Hub:** [https://hub.docker.com/r/filipebeniciodev/petmatch-backend](https://hub.docker.com/r/filipebeniciodev/petmatch-backend)

### Executando com Docker

Para baixar e executar o container diretamente do Docker Hub:

```bash
# Baixar a versão mais recente
docker pull filipebeniciodev/petmatch-backend:latest

# Executar a aplicação mapeando a porta 8080
docker run -p 8080:8080 filipebeniciodev/petmatch-backend:latest
```

### Construindo a imagem localmente

```bash
# Construir a imagem local
docker build -t filipebeniciodev/petmatch-backend .

# Executar o container localmente
docker run -p 8080:8080 filipebeniciodev/petmatch-backend
```

---

## Endpoints

### Listar Animais
Retorna uma lista de todos os animais cadastrados.

* **URL:** `/api/animais`
* **Método:** `GET`
* **Status de Retorno:** `200 OK`
* **Tipo de Conteúdo:** `application/json`

#### Exemplo de Resposta:

```json
[
  {
    "id": 1,
    "nome": "Rex",
    "especie": "Cachorro",
    "idade": 3,
    "disponivel": true
  },
  {
    "id": 2,
    "nome": "Mia",
    "especie": "Gato",
    "idade": 2,
    "disponivel": true
  },
  {
    "id": 3,
    "nome": "Luna",
    "especie": "Cachorro",
    "idade": 1,
    "disponivel": true
  }
]
```

---

### Cadastrar Animal
Cadastra um novo animal para adoção.

* **URL:** `/api/animais`
* **Método:** `POST`
* **Tipo de Conteúdo:** `application/json`

#### Body da Requisição:

```json
{
  "nome": "Thor",
  "especie": "Cachorro",
  "idade": 4
}
```

| Campo     | Tipo     | Obrigatório | Descrição                        |
|-----------|----------|-------------|----------------------------------|
| `nome`    | `string` | Sim         | Nome do animal                   |
| `especie` | `string` | Sim         | Espécie do animal                |
| `idade`   | `number` | Sim         | Idade do animal (>= 0)          |

#### Resposta de Sucesso:

* **Status:** `201 Created`

```json
{
  "id": 4,
  "nome": "Thor",
  "especie": "Cachorro",
  "idade": 4,
  "disponivel": true
}
```

> O `id` é gerado automaticamente pelo sistema e o campo `disponivel` é definido como `true`.

#### Resposta de Erro:

* **Status:** `400 Bad Request`

```json
{
  "message": "Nome, espécie e idade são obrigatórios"
}
```

#### Códigos de Status:

| Código | Descrição                         |
|--------|-----------------------------------|
| `201`  | Animal cadastrado com sucesso     |
| `400`  | Dados inválidos ou ausentes       |

---

### Remover Animal
Remove um animal cadastrado pelo seu identificador (ID).

* **URL:** `/api/animais/:id`
* **Método:** `DELETE`

#### Respostas:

| Código | Descrição                         |
|--------|-----------------------------------|
| `204`  | Animal removido com sucesso       |
| `404`  | Animal não encontrado             |

---

## Workflow Git

Este projeto segue o fluxo de trabalho **Gitflow**:

* A branch `main` contém o código estável e pronto para produção.
* Cada nova funcionalidade deve ser desenvolvida em sua própria branch de funcionalidade, nomeada com o padrão `feature/<nome-da-funcionalidade>` ou `ci/<nome>`.
* **É estritamente proibido realizar commits diretos na branch `main`.**
* Para integrar novas funcionalidades à branch `main`, deve-se abrir um **Pull Request (PR)**, o qual deve passar por revisão antes de ser mesclado.
