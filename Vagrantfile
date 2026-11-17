# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|

  # Imagem base: Ubuntu 22.04 LTS
  config.vm.box = "ubuntu/jammy64"

  # Nome da máquina virtual
  config.vm.hostname = "netdata-server"

  # Rede privada com IP fixo (Classe C) para acessar o dashboard
  config.vm.network "private_network", ip: "192.168.56.10"

  # Redireciona a porta 19999 do Netdata para o host
  config.vm.network "forwarded_port", guest: 19999, host: 19999

  # Configurações do VirtualBox
  config.vm.provider "virtualbox" do |vb|
    vb.name = "netdata-server"
    vb.memory = "1024"
    vb.cpus = 2
  end

  # Provisionamento automático: instala o Netdata
  config.vm.provision "shell", inline: <<-SHELL
    set -e
    export DEBIAN_FRONTEND=noninteractive

    echo "=========================================="
    echo " Atualizando pacotes do sistema..."
    echo "=========================================="
    apt-get update -y
    apt-get install -y curl wget

    echo "=========================================="
    echo " Instalando o Netdata..."
    echo "=========================================="
    # Instalação oficial do Netdata (modo não interativo)
    curl https://get.netdata.cloud/kickstart.sh > /tmp/netdata-kickstart.sh
    sh /tmp/netdata-kickstart.sh --non-interactive

    # Garante que o Netdata está rodando e habilitado no boot
    systemctl enable netdata
    systemctl start netdata

    echo "=========================================="
    echo " Netdata instalado com sucesso!"
    echo " Acesse o dashboard em:"
    echo "   http://192.168.56.10:19999"
    echo "   ou http://localhost:19999"
    echo "=========================================="
  SHELL

end
