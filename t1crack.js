function (context, a) { // t:#s.username.target
  var ez=["open","release","unlock"],
      primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97],
      colors = ["red", "orange", "yellow", "green", "lime", "blue", "cyan", "purple"],
	  locket=["6hh8xw","cmppiq", "sa23uw", "tvfkyq", "uphlaw", "vc2c7q", "xwz7ja"],
	  data_lock = [["to user +", "fran_lee"], ["+ is a", "robovac"], ["trust, +", "sentience"],
	  ["+ demonstrate", "sans_comedy"], ["angie's +", "angels"], ["mallory's +", "minions"],
	  ["che are +", "sisters"], ["+, the prover", "petra"], ["faythe's +", "fountain"], 
	  ["halperyon.+", "helpdesk"], ["descriptors of the +", "bunnybat"], 
	  ["scripts.++++++", "get_level"], ["service +", "weathernet"], ["+, the monitor", "eve"],
	  ["capture of +", "resource"], ["called +", "bo"], ["s' has +", "heard"], 
	  ["+ provides i", "teach"], ["+ uses", "outta_juice"], ["share +", "poetry"]],
      ret, args = {}, success=false,
      unlocked = /(LOCK_UNLOCKED)\s(ez_[0-9]{2}|c00[1-3])/g,
      locked = /LOCK_ERROR/g,
      locks = /(EZ_[0-9]{2}|c00[1-3]|DATA_CHECK|l0cket)/g,
      lock_list = [],
      ret, i, lock, o_lock // these are used later
	  
	function check_next(args, next) {
		ret = a.t.call(args)
		if (ret.includes("is missing") || ret.includes("unlocked") || ret.includes("Denied") || ret.includes("++++++") ) {
			return true
		}
	}
  while (!success) {
    ret = a.t.call(args)
	
    if (!locked.test(ret)) {
      success = true
      break
    }
    while (lock = locks.exec(ret)) {
      lock_list.push(lock[1])
    }
	o_lock = lock_list[lock_list.length - 1]
    lock = o_lock.toLowerCase()
    switch (lock) {
      case "ez_21":
      case "ez_35":
      case "ez_40":
        for (i=0; i<3; i++) {
          args[lock] = ez[i]
          if (check_next(args)) { break }
        }
        // Stop processing ez_21 locks here
        if (lock == "ez_21") { break }
        else if (lock == "ez_35") {
          // Process the rest of ez_35 locks.
          for (i=0; i<10; i++) {
            args.digit = i
            if (check_next(args)) { break }
          }
        }
        else if (lock == "ez_40") {
          // Process the rest of ez_40 locks.
          for (i=0; i<primes.length; i++) {
            args.ez_prime = primes[i]
            if (check_next(args)) { break }
          }
        }
        // Stop processing ez_35 or ez_40 locks.
        break
      case "c001":
      case "c002":
      case "c003":
        // Identify the base lock value.
        for (i=0; i<8; i++) {
          args[lock] = colors[i]
          if (check_next(args)) { break }
        }
        // Stop processing c001 locks here
        if (lock == "c001") {
          for (i=0; i<10; i++) {
            args.color_digit = i
            if (check_next(args)) { break }
          }
          break
        }
        // Set the first triad value.
        for (i=0; i<8; i++) {
          if (lock == "c002") { args["c002_complement"] = colors[i] }
          if (lock == "c003") { args["c003_triad_1"]    = colors[i] }
          if (check_next(args)) { break }
        }
        // Stop processing c002 locks here
        if (lock == "c002") { break }
        // Set the second triad value.
        for (i=0; i<8; i++) {
          args["c003_triad_2"] = colors[i]
          if (check_next(args)) { break }
        }
        // stop processing c003 locks here
        break
		
		case "l0cket":
		for (i=0; i<7; i++) {
          args[lock] = locket[i]
          if (check_next(args)) { break }
        }
		break
		
		case "data_check":
			args[o_lock] = ""
			check_next(args) // Get the riddle
			var s = ret.split("\n")
			for (i = 0; i < s.length; i++) {
				data_lock.forEach(function(e) {
					if(s[i].includes(e[0])) {
						args[o_lock] += e[1]
						return
					}
				})
			}
		break
    }
  }
  return {ok:success, msg:ret, args:args}
}
