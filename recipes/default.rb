#
# Cookbook Name:: session_service
# Recipe:: default
#
# Copyright (C) 2013 John Manero
#
# All rights reserved - Do Not Redistribute
#

## Add repo for recent Node.JS builds
apt_repository 'node.js' do
  uri "http://ppa.launchpad.net/chris-lea/node.js/ubuntu"
  distribution node['lsb']['codename']
  components ["main"]
  keyserver "keyserver.ubuntu.com"
  key "C7917B12"
end

## Packages
package "curl"
package "build-essential"
package "nodejs"
package "memcached"

group node["session_service"]["group"] do
  system true
end

user node["session_service"]["user"] do
  gid node["session_service"]["group"]
  home node["session_service"]["home"]
  shell "/bin/bash"
  system true
end

directory node["session_service"]["home"] do
  owner node["session_service"]["user"]
  group node["session_service"]["group"]
  recursive true
end

template "/etc/init/session.conf" do
  source "upstart.conf.erb"
  backup false
end

remote_directory node["session_service"]["home"] do
  source "source"
  files_backup false
  files_owner node["session_service"]["user"]
  files_group node["session_service"]["group"]
  files_mode 00644
  owner node["session_service"]["user"]
  group node["session_service"]["group"]
  mode 00755
  not_if {
    node["environment"] == "vagrant"
  }
end

execute "npm install" do
  cwd node["session_service"]["home"]
  user node["environment"] == "vagrant" ? "vagrant" : node["session_service"]["user"]
  group node["environment"] == "vagrant" ? "vagrant" : node["session_service"]["group"]
  environment({
    "HOME" => node["session_service"]["home"]
  })
end

file ::File::join(node["session_service"]["home"], "server.js") do
  mode "0755"
end

service "session" do
  provider Chef::Provider::Service::Upstart
  action [ :start, :enable ]
end
