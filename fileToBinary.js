var r = new FileReader();
r.onload = function(){ alert(r.result); };
r.readAsBinaryString(file);