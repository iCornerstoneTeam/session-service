#
# Cookbook Name:: ics_session
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

group node["ics_session"]["group"] do
  system true
end

user node["ics_session"]["user"] do
  gid node["ics_session"]["group"]
  home node["ics_session"]["home"]
  shell "/bin/bash"
  system true
end

directory node["ics_session"]["home"] do
  owner node["ics_session"]["user"]
  group node["ics_session"]["group"]
  recursive true
end

template "/etc/init/session.conf" do
  source "session.conf.erb"
  backup false
end

service "session" do
  provider Chef::Provider::Service::Upstart
  action [ :start, :enable ]
end

## TODO remote_directory
