$name = "mixpanel-export"

$script = <<SCRIPT
echo starting installation
apt-get update -y
sudo apt-get install -y nodejs npm
sudo ln -s /usr/bin/nodejs /usr/bin/node
sudo npm install nodemon -g
sudo npm install grunt-cli -g
npm install
echo installation done
SCRIPT

Vagrant.configure(2) do |config|
	config.vm.box = "ubuntu/trusty64"
	config.vm.hostname = "vagrant"
	config.vm.network :forwarded_port, guest: 3000, host: 3000
	config.vm.synced_folder ".", "/vagrant", owner: "vagrant", mount_options: ["dmode=775,fmode=775"]
	config.vm.provider "virtualbox" do |vb|
		vb.name = $name
		vb.memory = 800
	end
	config.vm.define $name do |t|
	end
	config.vm.provision "shell", inline: $script
end
