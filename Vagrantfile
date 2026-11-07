# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|
  # Imagem base utilizada em ambas as máquinas virtuais (Ubuntu 22.04 LTS)
  config.vm.box = "ubuntu/jammy64"

  # =========================================================================
  # VM1 - Máquina Cliente para Testes de Requisições
  # =========================================================================
  config.vm.define "vm1" do |vm1|
    vm1.vm.hostname = "vm1"

    # Endereço IPv4 privado (Classe C: 192.168.0.0/16)
    vm1.vm.network "private_network", ip: "192.168.56.10"

    # Configurações do Provedor VirtualBox
    vm1.vm.provider "virtualbox" do |vb|
      vb.name = "petmatch-vm1"
      vb.memory = 1024 # 1024 MB de memória principal
      vb.cpus = 1
    end

    # Provisionamento: Ferramentas de rede (curl, wget)
    vm1.vm.provision "shell", inline: <<-SHELL
      set -e
      echo "=== [VM1] Iniciando provisionamento da VM1 (Cliente) ==="
      export DEBIAN_FRONTEND=noninteractive
      apt-get update -y
      apt-get install -y curl wget iputils-ping
      echo "=== [VM1] VM1 provisionada com sucesso! Ferramentas curl e wget prontas. ==="
    SHELL
  end

  # =========================================================================
  # VM2 - Servidor Backend PetMatch
  # =========================================================================
  config.vm.define "vm2" do |vm2|
    vm2.vm.hostname = "vm2"

    # Endereço IPv4 privado (Classe C: 192.168.0.0/16) na mesma sub-rede da VM1
    vm2.vm.network "private_network", ip: "192.168.56.20"

    # Sincronização da pasta da aplicação com a pasta vagrant_data dentro da VM2
    vm2.vm.synced_folder ".", "/vagrant_data"

    # Configurações do Provedor VirtualBox
    vm2.vm.provider "virtualbox" do |vb|
      vb.name = "petmatch-vm2"
      # Quantidade de memória necessária para o backend (Node.js/TypeScript/Express):
      # 2048 MB alocados para garantir a instalação de dependências, compilação (tsc) e execução estável
      vb.memory = 2048
      vb.cpus = 2
    end

    # Provisionamento: Instalar dependências, compilar e executar a aplicação
    vm2.vm.provision "shell", inline: <<-SHELL
      set -e
      echo "=== [VM2] Iniciando provisionamento da VM2 (Backend) ==="
      export DEBIAN_FRONTEND=noninteractive

      # 1. Atualizar pacotes do sistema
      apt-get update -y
      apt-get install -y curl git build-essential

      # 2. Instalar Node.js 20.x (LTS) e npm
      if ! command -v node >/dev/null 2>&1; then
        echo "=== [VM2] Instalando Node.js 20.x LTS ==="
        curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
        apt-get install -y nodejs
      fi

      echo "=== [VM2] Node.js versão: $(node -v) | npm versão: $(npm -v) ==="

      # 3. Instalar dependências da aplicação na pasta sincronizada /vagrant_data
      echo "=== [VM2] Instalando dependências do projeto em /vagrant_data ==="
      cd /vagrant_data
      npm install --no-bin-links || npm install

      # 4. Compilar o projeto TypeScript
      echo "=== [VM2] Compilando aplicação TypeScript ==="
      npm run build

      # 5. Criar serviço systemd para manter a aplicação em execução
      echo "=== [VM2] Configurando serviço systemd da aplicação ==="
      cat <<'EOF' > /etc/systemd/system/petmatch.service
[Unit]
Description=PetMatch Backend API
After=network.target

[Service]
Type=simple
User=vagrant
WorkingDirectory=/vagrant_data
ExecStart=/usr/bin/node /vagrant_data/dist/server.js
Restart=always
RestartSec=5
Environment=NODE_ENV=production
Environment=PORT=8080

[Install]
WantedBy=multi-user.target
EOF

      # 6. Recarregar daemons, habilitar e iniciar a aplicação
      echo "=== [VM2] Inicializando serviço petmatch ==="
      systemctl daemon-reload
      systemctl enable petmatch
      systemctl restart petmatch

      # Aguardar inicialização do serviço
      sleep 2
      systemctl is-active --quiet petmatch && echo "=== [VM2] Aplicação PetMatch está em execução na porta 8080! ===" || (echo "Erro ao iniciar o serviço!" && systemctl status petmatch && exit 1)
    SHELL
  end
end

