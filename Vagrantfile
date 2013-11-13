# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|
  config.vm.hostname = "session-service"
  config.vm.box = "ubuntu-12.04-opscode-provisionerless"
  config.vm.box_url = "https://opscode-vm-bento.s3.amazonaws.com/vagrant/opscode_ubuntu-12.04_provisionerless.box"

  config.vm.provider "virtualbox" do |vb|
    vb.config.vm.customize ["modifyvm", :id, "--memory", 512]
  end
  config.vm.network :private_network, :ip => "10.255.255.243"
  config.vm.synced_folder "./files/default/source", "/srv/session"

  config.omnibus.chef_version = '11.6.2'
  config.berkshelf.enabled = true
  config.berkshelf.berksfile_path = "./Berksfile"

  config.vm.provision :chef_solo do |chef|
    #    chef.chef_server_url        = "https://fringe-04.m.dyn.io"
    #    chef.validation_client_name = "chef-validator"
    #    chef.validation_key_path    = "/Users/jmanero/.chef/fringe-validator.pem"

    chef.run_list = [
      "recipe[session_service::default]"
    ]
    chef.json = {
      "environment" => "vagrant"
    }
  end
end
