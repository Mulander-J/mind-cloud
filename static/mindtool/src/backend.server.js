MM.Backend.Server = Object.create(MM.Backend, {
	label: {value: "CloudServer"},
	id: {value: "server"},
	prefix: {value: "mm.map."}
});

MM.Backend.Server.save = function(data, id, name) {
	ServerStorage.setItem(this.prefix + id, data);

	var names = this.list();
	names[id] = name;
	ServerStorage.setItem(this.prefix + "names", JSON.stringify(names));
}

MM.Backend.Server.load = function(id) {
	var data = ServerStorage.getItem(this.prefix + id);
	if (!data) { throw new Error("There is no such saved map"); }
	return data;
}

MM.Backend.Server.remove = function(id) {
	ServerStorage.removeItem(this.prefix + id);

	var names = this.list();
	delete names[id];
	ServerStorage.setItem(this.prefix + "names", JSON.stringify(names));
}

MM.Backend.Server.list = function() {
	try {
		var data = ServerStorage.getItem(this.prefix + "names") || "{}";
		return JSON.parse(data);
	} catch (e) {
		return {};
	}
}
