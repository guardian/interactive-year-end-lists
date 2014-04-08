define([], function() {

    var players = [{"uid":1,"country":"Russia","name":"Lev Yashin","position":"GK","attack":0,"defense":18,"discipline":20,"creativity":0,"unpredictability":3,"volatility":0,"star quality":18},
{"uid":2,"country":"Germany","name":"Sepp Maier","position":"GK","attack":0,"defense":15,"discipline":18,"creativity":0,"unpredictability":10,"volatility":5,"star quality":16},
{"uid":3,"country":"Germany","name":"Oliver Kahn","position":"GK","attack":0,"defense":15,"discipline":13,"creativity":0,"unpredictability":15,"volatility":12,"star quality":14},
{"uid":4,"country":"Italy","name":"Dino Zoff","position":"GK","attack":0,"defense":18,"discipline":17,"creativity":0,"unpredictability":5,"volatility":3,"star quality":19},
{"uid":5,"country":"Czechoslovakia","name":"Viliam Schrojf","position":"GK","attack":0,"defense":18,"discipline":17,"creativity":0,"unpredictability":19,"volatility":5,"star quality":2},
{"uid":6,"country":"England","name":"Gordon Banks","position":"GK","attack":0,"defense":19,"discipline":18,"creativity":0,"unpredictability":5,"volatility":0,"star quality":20},
{"uid":7,"country":"Italy","name":"Gianluigi Buffon","position":"GK","attack":0,"defense":17,"discipline":18,"creativity":0,"unpredictability":3,"volatility":5,"star quality":17},
{"uid":8,"country":"Turky","name":"Rüştü Reçber","position":"GK","attack":0,"defense":13,"discipline":15,"creativity":0,"unpredictability":15,"volatility":10,"star quality":10},
{"uid":9,"country":"Russia","name":"Rinat Dasayev","position":"GK","attack":0,"defense":16,"discipline":16,"creativity":0,"unpredictability":7,"volatility":5,"star quality":7},
{"uid":10,"country":"Poland","name":"Jan Tomaszewski","position":"GK","attack":0,"defense":12,"discipline":18,"creativity":0,"unpredictability":18,"volatility":5,"star quality":12},
{"uid":11,"country":"Spain","name":"Andoni Zubizaretta","position":"GK","attack":0,"defense":12,"discipline":16,"creativity":0,"unpredictability":16,"volatility":7,"star quality":14},
{"uid":12,"country":"","name":"","position":"","attack":null,"defense":null,"discipline":null,"creativity":null,"unpredictability":null,"volatility":null,"star quality":null},
{"uid":13,"country":"Italy","name":"Paolo Maldini","position":"LB","attack":13,"defense":19,"discipline":18,"creativity":10,"unpredictability":7,"volatility":3,"star quality":12},
{"uid":14,"country":"Germany","name":"Hans-Peter Briegel","position":"LB","attack":6,"defense":18,"discipline":4,"creativity":3,"unpredictability":6,"volatility":18,"star quality":4},
{"uid":15,"country":"Brazil","name":"Roberto Carlos","position":"LB","attack":15,"defense":10,"discipline":10,"creativity":12,"unpredictability":14,"volatility":8,"star quality":15},
{"uid":16,"country":"Germany","name":"Andreas Brehme","position":"LB","attack":null,"defense":null,"discipline":null,"creativity":null,"unpredictability":null,"volatility":null,"star quality":null},
{"uid":17,"country":"Brazil","name":"Nílton Santos","position":"LB","attack":null,"defense":null,"discipline":null,"creativity":null,"unpredictability":null,"volatility":null,"star quality":null},
{"uid":18,"country":"Italy","name":"Giacinto Facchetti","position":"LB","attack":null,"defense":null,"discipline":null,"creativity":null,"unpredictability":null,"volatility":null,"star quality":null},
{"uid":19,"country":"Brazil","name":"Junior","position":"LB","attack":null,"defense":null,"discipline":null,"creativity":null,"unpredictability":null,"volatility":null,"star quality":null},
{"uid":20,"country":"","name":"","position":"LB","attack":null,"defense":null,"discipline":null,"creativity":null,"unpredictability":null,"volatility":null,"star quality":null},
{"uid":21,"country":"","name":"","position":"LB","attack":null,"defense":null,"discipline":null,"creativity":null,"unpredictability":null,"volatility":null,"star quality":null},
{"uid":22,"country":"","name":"","position":"LB","attack":null,"defense":null,"discipline":null,"creativity":null,"unpredictability":null,"volatility":null,"star quality":null},
{"uid":23,"country":"","name":"","position":"","attack":null,"defense":null,"discipline":null,"creativity":null,"unpredictability":null,"volatility":null,"star quality":null},
{"uid":24,"country":"England","name":"Bobby Moore","position":"CB","attack":null,"defense":null,"discipline":null,"creativity":null,"unpredictability":null,"volatility":null,"star quality":null},
{"uid":25,"country":"Germany","name":"Franz Beckenbauer","position":"CB","attack":11,"defense":18,"discipline":18,"creativity":6,"unpredictability":6,"volatility":4,"star quality":18},
{"uid":26,"country":"Italy","name":"Franco Baresi","position":"CB","attack":8,"defense":20,"discipline":20,"creativity":6,"unpredictability":3,"volatility":2,"star quality":20},
{"uid":27,"country":"Argentina","name":"Daniel Passarella","position":"CB","attack":null,"defense":null,"discipline":null,"creativity":null,"unpredictability":null,"volatility":null,"star quality":null},
{"uid":28,"country":"Chile","name":"Elías Figueroa","position":"CB","attack":null,"defense":null,"discipline":null,"creativity":null,"unpredictability":null,"volatility":null,"star quality":null},
{"uid":29,"country":"France","name":"Marcel Desailly","position":"CB","attack":6,"defense":17,"discipline":20,"creativity":3,"unpredictability":3,"volatility":9,"star quality":6},
{"uid":30,"country":"France","name":"Marius Trésor","position":"CB","attack":null,"defense":null,"discipline":null,"creativity":null,"unpredictability":null,"volatility":null,"star quality":null},
{"uid":31,"country":"South Korea","name":"Hong Myung-Bo","position":"CB","attack":null,"defense":null,"discipline":null,"creativity":null,"unpredictability":null,"volatility":null,"star quality":null},
{"uid":32,"country":"Ireland","name":"Paul McGrath ","position":"CB","attack":null,"defense":null,"discipline":null,"creativity":null,"unpredictability":null,"volatility":null,"star quality":null},
{"uid":33,"country":"Argentina","name":"Luis Monti","position":"CB","attack":null,"defense":null,"discipline":null,"creativity":null,"unpredictability":null,"volatility":null,"star quality":null},
{"uid":34,"country":"Italy","name":"Fabio Cannavaro","position":"CB","attack":null,"defense":null,"discipline":null,"creativity":null,"unpredictability":null,"volatility":null,"star quality":null},
{"uid":35,"country":"France","name":"Laurent Blanc","position":"CB","attack":null,"defense":null,"discipline":null,"creativity":null,"unpredictability":null,"volatility":null,"star quality":null},
{"uid":36,"country":"Germany","name":"Guido Buchwald","position":"CB","attack":null,"defense":null,"discipline":null,"creativity":null,"unpredictability":null,"volatility":null,"star quality":null},
{"uid":37,"country":"","name":"","position":"CB","attack":null,"defense":null,"discipline":null,"creativity":null,"unpredictability":null,"volatility":null,"star quality":null},
{"uid":38,"country":"","name":"","position":"CB","attack":null,"defense":null,"discipline":null,"creativity":null,"unpredictability":null,"volatility":null,"star quality":null},
{"uid":39,"country":"","name":"","position":"CB","attack":null,"defense":null,"discipline":null,"creativity":null,"unpredictability":null,"volatility":null,"star quality":null},
{"uid":40,"country":"","name":"","position":"CB","attack":null,"defense":null,"discipline":null,"creativity":null,"unpredictability":null,"volatility":null,"star quality":null},
{"uid":41,"country":"","name":"","position":"CB","attack":null,"defense":null,"discipline":null,"creativity":null,"unpredictability":null,"volatility":null,"star quality":null},
{"uid":42,"country":"","name":"","position":"CB","attack":null,"defense":null,"discipline":null,"creativity":null,"unpredictability":null,"volatility":null,"star quality":null},
{"uid":43,"country":"","name":"","position":"CB","attack":null,"defense":null,"discipline":null,"creativity":null,"unpredictability":null,"volatility":null,"star quality":null},
{"uid":44,"country":"","name":"","position":"CB","attack":null,"defense":null,"discipline":null,"creativity":null,"unpredictability":null,"volatility":null,"star quality":null},
{"uid":45,"country":"","name":"","position":"","attack":null,"defense":null,"discipline":null,"creativity":null,"unpredictability":null,"volatility":null,"star quality":null},
{"uid":46,"country":"Brazil","name":"Carlos Alberto","position":"RB","attack":20,"defense":20,"discipline":16,"creativity":13,"unpredictability":10,"volatility":5,"star quality":18},
{"uid":47,"country":"Brazil","name":"Cafu","position":"RB","attack":null,"defense":null,"discipline":null,"creativity":null,"unpredictability":null,"volatility":null,"star quality":null},
{"uid":48,"country":"Brazil","name":"Josimar","position":"RB","attack":20,"defense":14,"discipline":12,"creativity":18,"unpredictability":20,"volatility":10,"star quality":18},
{"uid":49,"country":"France","name":"Lilian Thuram","position":"RB","attack":null,"defense":null,"discipline":null,"creativity":null,"unpredictability":null,"volatility":null,"star quality":null},
{"uid":50,"country":"Brazil","name":"Djalma Santos","position":"RB","attack":null,"defense":null,"discipline":null,"creativity":null,"unpredictability":null,"volatility":null,"star quality":null},
{"uid":51,"country":"Italy","name":"Giuseppe Bergomi","position":"RB","attack":null,"defense":null,"discipline":null,"creativity":null,"unpredictability":null,"volatility":null,"star quality":null},
{"uid":52,"country":"Germany","name":"Paul Breitner","position":"RB","attack":17,"defense":18,"discipline":20,"creativity":12,"unpredictability":10,"volatility":5,"star quality":17},
{"uid":53,"country":"Italy","name":"Claudio Gentile","position":"RB","attack":3,"defense":20,"discipline":20,"creativity":4,"unpredictability":3,"volatility":13,"star quality":16},
{"uid":54,"country":"","name":"","position":"RB","attack":null,"defense":null,"discipline":null,"creativity":null,"unpredictability":null,"volatility":null,"star quality":null},
{"uid":55,"country":"","name":"","position":"RB","attack":null,"defense":null,"discipline":null,"creativity":null,"unpredictability":null,"volatility":null,"star quality":null},
{"uid":56,"country":"","name":"","position":"","attack":null,"defense":null,"discipline":null,"creativity":null,"unpredictability":null,"volatility":null,"star quality":null},
{"uid":57,"country":"France","name":"Zinedine Zidane","position":"LM","attack":null,"defense":null,"discipline":null,"creativity":null,"unpredictability":null,"volatility":null,"star quality":null},
{"uid":58,"country":"Holland","name":"Johan Cruyff","position":"LM","attack":null,"defense":null,"discipline":null,"creativity":null,"unpredictability":null,"volatility":null,"star quality":null},
{"uid":59,"country":"Sweden","name":"Lennart Skoglund","position":"LM","attack":null,"defense":null,"discipline":null,"creativity":null,"unpredictability":null,"volatility":null,"star quality":null},
{"uid":60,"country":"Bulgaria","name":"Hristo Stoichkov","position":"LM","attack":18,"defense":1,"discipline":2,"creativity":20,"unpredictability":20,"volatility":20,"star quality":17},
{"uid":61,"country":"Brazil","name":"Mario Zagallo","position":"LM","attack":null,"defense":null,"discipline":null,"creativity":null,"unpredictability":null,"volatility":null,"star quality":null},
{"uid":62,"country":"Spain","name":"Paco Gento","position":"LM","attack":null,"defense":null,"discipline":null,"creativity":null,"unpredictability":null,"volatility":null,"star quality":null},
{"uid":63,"country":"Hungary","name":"Zoltan Czibor","position":"LM","attack":null,"defense":null,"discipline":null,"creativity":null,"unpredictability":null,"volatility":null,"star quality":null},
{"uid":64,"country":"Sweden","name":"Tomas Brolin","position":"LM","attack":16,"defense":6,"discipline":11,"creativity":16,"unpredictability":16,"volatility":7,"star quality":13},
{"uid":65,"country":"Romainia","name":"Gheorge Hagi","position":"LM","attack":null,"defense":null,"discipline":null,"creativity":null,"unpredictability":null,"volatility":null,"star quality":null},
{"uid":66,"country":"","name":"","position":"","attack":null,"defense":null,"discipline":null,"creativity":null,"unpredictability":null,"volatility":null,"star quality":null},
{"uid":67,"country":"Brazil","name":"Zico","position":"CM","attack":null,"defense":null,"discipline":null,"creativity":null,"unpredictability":null,"volatility":null,"star quality":null},
{"uid":68,"country":"Germany","name":"Lothar Matthäus","position":"CM","attack":null,"defense":null,"discipline":null,"creativity":null,"unpredictability":null,"volatility":null,"star quality":null},
{"uid":69,"country":"France","name":"Michel Platini","position":"CM","attack":null,"defense":null,"discipline":null,"creativity":null,"unpredictability":null,"volatility":null,"star quality":null},
{"uid":70,"country":"French","name":"Alain Giresse","position":"CM","attack":null,"defense":null,"discipline":null,"creativity":null,"unpredictability":null,"volatility":null,"star quality":null},
{"uid":71,"country":"Spain","name":"Xavi","position":"CM","attack":null,"defense":null,"discipline":null,"creativity":null,"unpredictability":null,"volatility":null,"star quality":null},
{"uid":72,"country":"England","name":"Bobby Charlton","position":"CM","attack":null,"defense":null,"discipline":null,"creativity":null,"unpredictability":null,"volatility":null,"star quality":null},
{"uid":73,"country":"Argentina","name":"Luis Monti","position":"CM","attack":12,"defense":20,"discipline":18,"creativity":10,"unpredictability":5,"volatility":20,"star quality":15},
{"uid":74,"country":"Uruguay","name":"Obdulio Varela","position":"CM","attack":16,"defense":20,"discipline":20,"creativity":18,"unpredictability":15,"volatility":20,"star quality":20},
{"uid":75,"country":"Austria","name":"Matthias Sindelar","position":"CM","attack":18,"defense":2,"discipline":15,"creativity":19,"unpredictability":20,"volatility":7,"star quality":17},
{"uid":76,"country":"Uruguay","name":"Juan Alberto Schiaffino","position":"CM","attack":18,"defense":14,"discipline":15,"creativity":18,"unpredictability":10,"volatility":5,"star quality":18},
{"uid":77,"country":"","name":"","position":"","attack":null,"defense":null,"discipline":null,"creativity":null,"unpredictability":null,"volatility":null,"star quality":null},
{"uid":78,"country":"Uruguay","name":"Alcides Ghiggia","position":"CM","attack":17,"defense":3,"discipline":15,"creativity":19,"unpredictability":17,"volatility":5,"star quality":13},
{"uid":79,"country":"Sweden","name":"Nils Liedholm","position":"CM","attack":19,"defense":10,"discipline":20,"creativity":18,"unpredictability":10,"volatility":2,"star quality":14},
{"uid":80,"country":"Holland","name":"Ruud Gullit","position":"CM","attack":18,"defense":18,"discipline":18,"creativity":15,"unpredictability":10,"volatility":5,"star quality":19},
{"uid":81,"country":"England","name":"Paul Gascoigne","position":"CM","attack":18,"defense":14,"discipline":5,"creativity":18,"unpredictability":20,"volatility":20,"star quality":19},
{"uid":82,"country":"","name":"","position":"CM","attack":null,"defense":null,"discipline":null,"creativity":null,"unpredictability":null,"volatility":null,"star quality":null},
{"uid":83,"country":"","name":"","position":"CM","attack":null,"defense":null,"discipline":null,"creativity":null,"unpredictability":null,"volatility":null,"star quality":null},
{"uid":84,"country":"Hungary","name":"Ferenc Puskas","position":"CM","attack":20,"defense":4,"discipline":8,"creativity":19,"unpredictability":19,"volatility":20,"star quality":20},
{"uid":85,"country":"Holland","name":"Johann Neeskens","position":"CM","attack":18,"defense":15,"discipline":15,"creativity":16,"unpredictability":13,"volatility":17,"star quality":17},
{"uid":86,"country":"Brazil","name":"Roberto Rivelino","position":"CM","attack":18,"defense":6,"discipline":9,"creativity":18,"unpredictability":16,"volatility":14,"star quality":18},
{"uid":87,"country":"","name":"","position":"CM","attack":null,"defense":null,"discipline":null,"creativity":null,"unpredictability":null,"volatility":null,"star quality":null},
{"uid":88,"country":"","name":"","position":"","attack":null,"defense":null,"discipline":null,"creativity":null,"unpredictability":null,"volatility":null,"star quality":null},
{"uid":89,"country":"Brazil","name":"Jairzinho","position":"RM","attack":20,"defense":3,"discipline":15,"creativity":14,"unpredictability":13,"volatility":6,"star quality":18},
{"uid":90,"country":"Brazil","name":"Garrincha","position":"RM","attack":20,"defense":0,"discipline":0,"creativity":20,"unpredictability":20,"volatility":20,"star quality":20},
{"uid":91,"country":"Poland","name":"Zbigniew Boniek","position":"RM","attack":14,"defense":12,"discipline":16,"creativity":14,"unpredictability":10,"volatility":6,"star quality":12},
{"uid":92,"country":"Portgual","name":"Cristiano Ronaldo","position":"RM","attack":19,"defense":17,"discipline":17,"creativity":19,"unpredictability":18,"volatility":15,"star quality":20},
{"uid":93,"country":"England","name":"David Beckham","position":"RM","attack":14,"defense":15,"discipline":8,"creativity":14,"unpredictability":6,"volatility":16,"star quality":20},
{"uid":94,"country":"Denmark","name":"Brian Laudrup","position":"RM","attack":13,"defense":10,"discipline":12,"creativity":16,"unpredictability":18,"volatility":5,"star quality":13},
{"uid":95,"country":"","name":"","position":"RM","attack":null,"defense":null,"discipline":null,"creativity":null,"unpredictability":null,"volatility":null,"star quality":null},
{"uid":96,"country":"","name":"","position":"RM","attack":null,"defense":null,"discipline":null,"creativity":null,"unpredictability":null,"volatility":null,"star quality":null},
{"uid":97,"country":"","name":"","position":"RM","attack":null,"defense":null,"discipline":null,"creativity":null,"unpredictability":null,"volatility":null,"star quality":null},
{"uid":98,"country":"","name":"","position":"RM","attack":null,"defense":null,"discipline":null,"creativity":null,"unpredictability":null,"volatility":null,"star quality":null},
{"uid":99,"country":"","name":"","position":"","attack":null,"defense":null,"discipline":null,"creativity":null,"unpredictability":null,"volatility":null,"star quality":null},
{"uid":100,"country":"Brazil","name":"Pelé","position":"ST","attack":20,"defense":12,"discipline":7,"creativity":20,"unpredictability":20,"volatility":17,"star quality":20},
{"uid":101,"country":"Argentina","name":"Diego Maradona","position":"ST","attack":20,"defense":12,"discipline":7,"creativity":20,"unpredictability":20,"volatility":20,"star quality":20},
{"uid":102,"country":"France","name":"Just Fontaine","position":"ST","attack":20,"defense":10,"discipline":16,"creativity":12,"unpredictability":14,"volatility":7,"star quality":17},
{"uid":103,"country":"Germany","name":"Gerd Müller","position":"ST","attack":20,"defense":8,"discipline":17,"creativity":8,"unpredictability":8,"volatility":3,"star quality":20},
{"uid":104,"country":"Brazil","name":"Ronaldo","position":"ST","attack":16,"defense":7,"discipline":12,"creativity":12,"unpredictability":18,"volatility":10,"star quality":19},
{"uid":105,"country":"England","name":"Gary Lineker","position":"ST","attack":14,"defense":5,"discipline":18,"creativity":10,"unpredictability":5,"volatility":0,"star quality":17},
{"uid":106,"country":"Italy","name":"Paolo Rossi","position":"ST","attack":16,"defense":10,"discipline":12,"creativity":10,"unpredictability":7,"volatility":12,"star quality":17},
{"uid":107,"country":"Argentina","name":"Mario Kempes","position":"ST","attack":17,"defense":10,"discipline":10,"creativity":15,"unpredictability":15,"volatility":14,"star quality":16},
{"uid":108,"country":"Peru","name":"Teófilo Cubillas","position":"ST","attack":18,"defense":8,"discipline":12,"creativity":19,"unpredictability":17,"volatility":9,"star quality":13},
{"uid":109,"country":"","name":"","position":"ST","attack":null,"defense":null,"discipline":null,"creativity":null,"unpredictability":null,"volatility":null,"star quality":null},
{"uid":110,"country":"Argentina","name":"Messi","position":"ST","attack":20,"defense":1,"discipline":10,"creativity":18,"unpredictability":20,"volatility":14,"star quality":20},
{"uid":111,"country":"Uruguay","name":"Hector Castro","position":"ST","attack":18,"defense":5,"discipline":15,"creativity":17,"unpredictability":12,"volatility":5,"star quality":18},
{"uid":112,"country":"Brazil","name":"Leonidas","position":"ST","attack":16,"defense":5,"discipline":15,"creativity":20,"unpredictability":20,"volatility":10,"star quality":18},
{"uid":113,"country":"Brazil","name":"Ademir","position":"ST","attack":20,"defense":5,"discipline":20,"creativity":20,"unpredictability":20,"volatility":12,"star quality":20},
{"uid":114,"country":"Germany","name":"Fritz Walter","position":"ST","attack":15,"defense":12,"discipline":20,"creativity":16,"unpredictability":10,"volatility":2,"star quality":19},
{"uid":115,"country":"Germany","name":"Max Morlock","position":"ST","attack":15,"defense":15,"discipline":18,"creativity":14,"unpredictability":10,"volatility":5,"star quality":15},
{"uid":116,"country":"Sweden","name":"Gunnar Gren","position":"ST","attack":16,"defense":10,"discipline":18,"creativity":16,"unpredictability":7,"volatility":3,"star quality":18},
{"uid":117,"country":"Hungary","name":"Ferenc Bene","position":"ST","attack":17,"defense":7,"discipline":14,"creativity":15,"unpredictability":13,"volatility":8,"star quality":14},
{"uid":118,"country":"Brazil","name":"Romário","position":"ST","attack":18,"defense":5,"discipline":15,"creativity":14,"unpredictability":19,"volatility":10,"star quality":17},
{"uid":119,"country":"Italy","name":"Roberto Baggio","position":"ST","attack":17,"defense":8,"discipline":18,"creativity":19,"unpredictability":17,"volatility":5,"star quality":19},
{"uid":120,"country":"Italy","name":"Salvatore Schillaci","position":"ST","attack":15,"defense":12,"discipline":10,"creativity":10,"unpredictability":8,"volatility":7,"star quality":12},
{"uid":121,"country":"Portugal","name":"Eusabio","position":"ST","attack":20,"defense":8,"discipline":16,"creativity":19,"unpredictability":18,"volatility":14,"star quality":17},
{"uid":122,"country":"Hungary","name":"Sandor Kocsis","position":"ST","attack":20,"defense":8,"discipline":17,"creativity":17,"unpredictability":17,"volatility":5,"star quality":18},
{"uid":123,"country":"Cameroon","name":"Roger Milla","position":"ST","attack":14,"defense":10,"discipline":15,"creativity":11,"unpredictability":18,"volatility":10,"star quality":14},
{"uid":124,"country":"Germany","name":"Karl-Heinz Rumenigge","position":"ST","attack":17,"defense":12,"discipline":15,"creativity":13,"unpredictability":10,"volatility":5,"star quality":15}];

    return players;

});
