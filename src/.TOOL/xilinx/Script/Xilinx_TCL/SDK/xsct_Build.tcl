set hw_path  ./user/Software/data
set ws_path  ./user/Software/src

openhw $ws_path/[getprojects -type hw]/system.hdf 

projects -build