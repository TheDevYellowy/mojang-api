# Table of Contents

- [Username to UUID](#usernametouuid)
- [UUID to Profile](#uuidtoprofile)
- [Name History](#namehistory)

### Default
```js
const MojangAPI = require('mojangapi');
const api = new MojangAPI('PlaceTokenHereWithoutBearer');
```

### usernameToUUID
```js
const uuid = api.usernameToUUID('Technoblade');

// returns the id in a string
b876ec32e396476ba1158438d83c67d4
```

### UUIDtoProfile
```js
const profile = api.UUIDtoProfile(uuid);

// returns the profile in an object
{
  timestamp: 1659516616090,
  profileId: 'e80e8194323e414298515e1bcb8a3508',
  profileName: 'TommyInnit',
  textures: {
    SKIN: {
      url: 'http://textures.minecraft.net/texture/3ce16dae339b7ad3b98da313e565c85652838acc1caff8a7292d1778578808cc'
    }
  }
}
```

### nameHistory
```js
const history = api.nameHistory(uuid);

// returns an array of names
[
  { name: 'DeltaNinja' },
  { name: 'Dream', changedToAt: 1423044676000 }
]
```