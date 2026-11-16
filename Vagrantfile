# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|
  # Imagem base utilizada em ambas as máquinas virtuais (Ubuntu 22.04 LTS)
  config.vm.box = "ubuntu/jammy64"

  # =========================================================================
  # VM1 - Nó de controle Ansible e cliente para testes
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

    # Sincronizar a configuração para executar Ansible dentro da VM1
    vm1.vm.synced_folder ".", "/vagrant_data"

    # Provisionamento: Ansible, cliente HTTP e chave usada para acessar a VM2
    vm1.vm.provision "shell", inline: <<-SHELL
      set -e
      echo "=== [VM1] Configurando nó de controle Ansible ==="
      export DEBIAN_FRONTEND=noninteractive
      apt-get update -y
      apt-get install -y ansible curl wget iputils-ping
      install -d -m 700 -o vagrant -g vagrant /home/vagrant/.ssh
      if [ ! -f /home/vagrant/.ssh/id_ed25519 ]; then
        sudo -u vagrant ssh-keygen -q -t ed25519 -N '' -f /home/vagrant/.ssh/id_ed25519
      fi
      install -d -m 755 /vagrant_data/.vagrant
      cp /home/vagrant/.ssh/id_ed25519.pub /vagrant_data/.vagrant/ansible-vm1.pub
      chown vagrant:vagrant /home/vagrant/.ssh/id_ed25519*
      chmod 600 /home/vagrant/.ssh/id_ed25519
      echo "=== [VM1] Nó de controle Ansible provisionado. ==="
    SHELL
  end

  # =========================================================================
  # VM2 - Servidor Backend PetMatch
  # =========================================================================
  config.vm.define "vm2" do |vm2|
    vm2.vm.hostname = "vm2"

    # Endereço IPv4 privado (Classe C: 192.168.0.0/16) na mesma sub-rede da VM1
    vm2.vm.network "private_network", ip: "192.168.56.20"

    # Pasta compartilhada apenas para distribuir a chave pública da VM1 no bootstrap.
    # O playbook clona o repositório em /opt/petmatch.
    vm2.vm.synced_folder ".", "/vagrant_data"

    # Configurações do Provedor VirtualBox
    vm2.vm.provider "virtualbox" do |vb|
      vb.name = "petmatch-vm2"
      # Quantidade de memória necessária para o backend (Node.js/TypeScript/Express):
      # 2048 MB alocados para garantir a instalação de dependências, compilação (tsc) e execução estável
      vb.memory = 2048
      vb.cpus = 2
    end

    # Bootstrap mínimo para permitir que o Ansible da VM1 gerencie a VM2.
    vm2.vm.provision "shell", inline: <<-SHELL
      set -e
      echo "=== [VM2] Preparando acesso remoto do Ansible ==="
      export DEBIAN_FRONTEND=noninteractive
      apt-get update -y
      apt-get install -y openssh-server
      install -d -m 700 -o vagrant -g vagrant /home/vagrant/.ssh
      cat /vagrant_data/.vagrant/ansible-vm1.pub >> /home/vagrant/.ssh/authorized_keys
      chown vagrant:vagrant /home/vagrant/.ssh/authorized_keys
      chmod 600 /home/vagrant/.ssh/authorized_keys
      echo "=== [VM2] Acesso SSH do Ansible habilitado. ==="
    SHELL
  end
end

