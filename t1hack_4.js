function (context, args) { // t:#s.username.target
    var harvest = (x) => { return #fs.elec0.t1harvest(x) },
    crack = (x) => { return #fs.elec0.t1crack(x)},
    npcs,
    r = (l) => { return Math.floor(Math.random() * l)}, p, i, picked

    // Make sure we actually get the npcs, sometimes the harvester script doesn't
    // properly work due to corruption and stuff
    while(true) {
        npcs = harvest(args)
        if(npcs.length > 2)
            break
    }
    picked = []
    for(i = 0; i < 4; ++i) {
        p = r(npcs.length)
        picked.push(npcs.splice(p, 1)[0])
    }
    picked.forEach(function(e) {
        #D("t1crack {t:#s." + e + "}")
    })

   return 0
}