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

## Infraestrutura Virtual com Vagrant (VirtualBox)

O projeto conta com uma configuração automatizada de infraestrutura multi-máquina gerenciada via **Vagrant** utilizando o provedor **VirtualBox**.

### Arquitetura das Máquinas Virtuais

| Máquina | Função | Memória RAM | Endereço IPv4 Privado (Classe C) | Descrição / Provisionamento |
|---------|--------|-------------|-----------------------------------|-----------------------------|
| **VM1** | Nó de controle Ansible e cliente de testes | 1024 MB | `192.168.56.10` | Provisionada com Ansible, `curl`, `wget`, `ping` e uma chave SSH para administrar a VM2. |
| **VM2** | Servidor Backend | 2048 MB | `192.168.56.20` | Recebe o código clonado pelo playbook, dependências Node.js 20 LTS e serviço `systemd`. |

> **Nota sobre a Memória da VM2:** Foram definidos **2048 MB** de memória principal para a VM2, garantindo os recursos necessários para a instalação dos módulos npm, processo de compilação TypeScript (`tsc`) e execução contínua do runtime do Node.js/Express.

### Pré-requisitos

Antes de iniciar, certifique-se de ter instalado em seu computador:
* [Oracle VM VirtualBox](https://www.virtualbox.org/wiki/Downloads) (versão 6.1 ou 7.x)
* [HashiCorp Vagrant](https://developer.hashicorp.com/vagrant/install) (versão 2.3+)

---

### Passo a Passo para Executar a Infraestrutura

1. **Clonar e acessar o repositório:**
   ```bash
   git clone https://github.com/Rafaell-dev/PetMatch.git
   cd PetMatch
   ```

2. **Inicializar as Máquinas Virtuais:**
   Execute o comando abaixo na raiz do projeto (onde está o `Vagrantfile`). O Vagrant fará o download da box base (Ubuntu 22.04 LTS), criará as duas VMs, instalará o Ansible na VM1 e preparará o acesso SSH entre as máquinas:
   ```bash
   vagrant up
   ```

   Suba as duas máquinas juntas e nessa ordem: a VM1 cria a chave usada pelo Ansible e a VM2 autoriza essa chave.

3. **Verificar o status das VMs:**
   ```bash
   vagrant status
   ```
   Ambas as máquinas (`vm1` e `vm2`) devem constar com o status `running (virtualbox)`.

### Configuração e execução com Ansible

O arquivo `ansible/ansible.cfg` e o inventário `ansible/inventory.ini` são montados em `/vagrant_data/ansible` dentro da VM1. O inventário aponta para a VM2 (`192.168.56.20`) e usa a chave SSH criada durante o provisionamento. O playbook `ansible/configura-node.yaml` instala Node.js 20 e ferramentas de compilação na VM2, clona este repositório em `/opt/petmatch`, instala as dependências com `npm ci`, compila o TypeScript e configura a API como serviço `systemd` na porta 8080.

Execute o playbook a partir da VM1:

```bash
vagrant ssh vm1
cd /vagrant_data/ansible
ansible all -m ping
ansible-playbook configura-node.yaml
```

O `ansible all -m ping` deve responder com `pong`. Ao final do playbook, a tarefa de espera confirma que a porta 8080 está aceitando conexões na VM2. Para verificar o serviço posteriormente, use `sudo systemctl status petmatch` na VM2.

### Executar e testar a aplicação

Depois de executar o playbook, a API fica disponível em `http://192.168.56.20:8080`. Na VM1, teste a rota de listagem de animais:

```bash
curl -i http://192.168.56.20:8080/api/animais
# alternativa
wget -qO- http://192.168.56.20:8080/api/animais
```

O `curl -i` deve mostrar o status `HTTP/1.1 200 OK` e uma resposta JSON com os animais cadastrados.

---

### Como Testar a Rota GET dentro da VM1

Após executar o playbook Ansible, a aplicação backend na **VM2** estará em execução e escutando requisições em `http://192.168.56.20:8080`.

1. **Acessar a VM1 via SSH:**
   ```bash
   vagrant ssh vm1
   ```

2. **Executar o teste da rota GET `/api/animais` a partir da VM1:**

   * **Opção A: Testando com `curl`**
     ```bash
     curl -i http://192.168.56.20:8080/api/animais
     ```
     *(O parâmetro `-i` exibe os cabeçalhos HTTP da resposta, incluindo o status `HTTP/1.1 200 OK`).*

   * **Opção B: Testando com `wget`**
     ```bash
     wget -qO- http://192.168.56.20:8080/api/animais
     ```
     *(O parâmetro `-qO-` executa a requisição silenciosamente e exibe o corpo JSON diretamente no terminal).*

3. **Exemplo de Retorno Esperado:**
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

4. **Sair da sessão SSH da VM1:**
   ```bash
   exit
   ```

---

### Comandos Úteis de Gerenciamento do Vagrant

* **Pausar/Suspender as VMs:**
  ```bash
  vagrant suspend
  ```
* **Desligar as VMs graciosamente:**
  ```bash
  vagrant halt
  ```
* **Reiniciar e aplicar novos provisionamentos:**
  ```bash
  vagrant reload --provision
  ```
* **Destruir as máquinas virtuais e liberar espaço em disco:**
  ```bash
  vagrant destroy -f
  ```

---

## Workflow Git

Este projeto segue o fluxo de trabalho **Gitflow**:

* A branch `main` contém o código estável e pronto para produção.
* Cada nova funcionalidade deve ser desenvolvida em sua própria branch de funcionalidade, nomeada com o padrão `feature/<nome-da-funcionalidade>` ou `ci/<nome>`.
* **É estritamente proibido realizar commits diretos na branch `main`.**
* Para integrar novas funcionalidades à branch `main`, deve-se abrir um **Pull Request (PR)**, o qual deve passar por revisão antes de ser mesclado.
