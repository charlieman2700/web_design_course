
pushBuild:
	rsync  -a ./build eb87741@10.1.4.63:~/public_html/tareas/addressHomework

push:
	rsync --exclude node_modules -a ./ eb87741@10.1.4.63:~/public_html/tareas/addressHomework

pull:
	rsync --exclude node_modules -a eb87741@10.1.4.63:/~public_html/tareas/addressHomework ./

tunneling:
	ssh -L 3001:localhost:3306 eb87741@10.1.4.63

tunneling2:
	ssh -D 1080 eb87741@10.1.4.63
