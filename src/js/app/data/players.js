define([], function() {

    var imagePath = '/images/player-';

    var players = [
        { name: 'Ronaldo', apps: 98, gls: 62, uid: 1, country: 'Brazil', position: 'Striker', imageSrc: imagePath + 'ronaldo.jpg' },
        { name: 'Maradonna', apps: 91, gls: 34, uid: 2, country: 'Argentina', position: 'Striker', imageSrc: imagePath + 'maradonna.jpg'},
        { name: 'Baggio', apps: 56, gls: 27, uid: 3, country: 'Italy', position: 'Striker', imageSrc: imagePath + 'baggio.jpg'},
        { name: 'Banks', apps: 73, gls: 0, uid: 4, country: 'England', position: 'Goalkeeper', imageSrc: imagePath + 'banks.jpg'},
        { name: 'Beckenbauer', apps: 103, gls: 14, uid: 5, country: 'Germany', position: 'Defender', imageSrc: imagePath + 'beckenbauer.jpg'},
        { name: 'Cruyff', apps: 48, gls: 33, uid: 6, country: 'Holland', position: 'Midfield', imageSrc: imagePath + 'cruijff.jpg'},
        { name: 'Eusebio', apps: 64, gls: 41, uid: 7, country: 'Portugal', position: 'Midfield', imageSrc: imagePath + 'eusebio.jpg'},
        { name: 'Klinsmann', apps: 80, gls: 38, uid: 8, country: 'Germany', position: 'Striker', imageSrc: imagePath + 'klinsmann.jpg'},
        { name: 'Moore', apps: 108, gls: 2, uid: 9, country: 'England', position: 'Defender', imageSrc: imagePath + 'moore.jpg'},
        { name: 'Pele', apps: 92, gls: 77, uid: 10, country: 'Brazil', position: 'Striker', imageSrc: imagePath + 'pele.jpg'},
        { name: 'Baines', apps: 92, gls: 77, uid: 10, country: 'England', position: 'LB', imageSrc: imagePath + 'baines.jpg'}
    ];

    var bios = [
        'Ronaldo Luís Nazário de Lima (locally: [ʁoˈnawðu ˈlwiʒ nɐˈzaɾju dʒ ˈɫĩmɐ]; born 18 September 1976[2]) commonly known as Ronaldo, is a retired Brazilian footballer. Popularly dubbed "the phenomenon", he is considered by experts and fans to be one of the greatest football players of all time.[3][4] He is one of only three men to have won the FIFA World Player of the Year award three times or more, along with Zinedine Zidane and Lionel Messi. He won his first Ballon d\'Or in 1997 and won the award again in 2002.',
        'Diego Armando Maradona Franco is an Argentine footballer who currently plays for Deportivo Riestra in the fifth tier of Argentina football. He has served as a manager and coach at other clubs as well as for the national team of Argentina.', 
        'Edson Arantes do Nascimento (Brazilian Portuguese: [ˈɛtsõ (w)ɐˈɾɐ̃tʃiz du nɐsiˈmẽtu]), better known as Pelé (Brazilian Portuguese: [pe̞ˈlɛ], name given as Edison on birth certificate, born 21 October 1940 – however, Pelé claims that he was born on 23 October[1]), is a retired Brazilian footballer. He is regarded by many experts, football critics, former players, current players and football fans in general as the best player of all time.[12] In 1999, he was voted World Player of the Century by the International Federation of Football History & Statistics.[13] The same year, influential France Football magazine consulted their former Ballon D\'Or winners to elect the Football Player of the Century. Pelé came in first place.[14] In 1999, Pelé was elected \"Athlete of the Century\" by the IOC, and was named in Time magazine\'s list of 100 most influential people of the 20th century.[15] In 2013 he received the FIFA Ballon d\'Or Prix d\'Honneur in recognition of his career and achievements as a global icon of football.', 
        'Gordon Banks, OBE (born 30 December 1937) is a former England international football goalkeeper. He made 628 appearances during a 15 year career in the Football League, and won 73 caps for his country. The IFFHS named Banks the second best goalkeeper of the 20th century – after Lev Yashin (1st) and ahead of Dino Zoff (3rd). He was named FWA Footballer of the Year in 1972, and was named FIFA Goalkeeper of the Year on six occasions.', 
        'Ronaldo Luís Nazário de Lima (locally: [ʁoˈnawðu ˈlwiʒ nɐˈzaɾju dʒ ˈɫĩmɐ]; born 18 September 1976[2]) commonly known as Ronaldo, is a retired Brazilian footballer. Popularly dubbed "the phenomenon", he is considered by experts and fans to be one of the greatest football players of all time.[3][4] He is one of only three men to have won the FIFA World Player of the Year award three times or more, along with Zinedine Zidane and Lionel Messi. He won his first Ballon d\'Or in 1997 and won the award again in 2002.', 
        'Ronaldo Luís Nazário de Lima (locally: [ʁoˈnawðu ˈlwiʒ nɐˈzaɾju dʒ ˈɫĩmɐ]; born 18 September 1976[2]) commonly known as Ronaldo, is a retired Brazilian footballer. Popularly dubbed "the phenomenon", he is considered by experts and fans to be one of the greatest football players of all time.[3][4] He is one of only three men to have won the FIFA World Player of the Year award three times or more, along with Zinedine Zidane and Lionel Messi. He won his first Ballon d\'Or in 1997 and won the award again in 2002.', 
        'Ronaldo Luís Nazário de Lima (locally: [ʁoˈnawðu ˈlwiʒ nɐˈzaɾju dʒ ˈɫĩmɐ]; born 18 September 1976[2]) commonly known as Ronaldo, is a retired Brazilian footballer. Popularly dubbed "the phenomenon", he is considered by experts and fans to be one of the greatest football players of all time.[3][4] He is one of only three men to have won the FIFA World Player of the Year award three times or more, along with Zinedine Zidane and Lionel Messi. He won his first Ballon d\'Or in 1997 and won the award again in 2002.', 
        'Ronaldo Luís Nazário de Lima (locally: [ʁoˈnawðu ˈlwiʒ nɐˈzaɾju dʒ ˈɫĩmɐ]; born 18 September 1976[2]) commonly known as Ronaldo, is a retired Brazilian footballer. Popularly dubbed "the phenomenon", he is considered by experts and fans to be one of the greatest football players of all time.[3][4] He is one of only three men to have won the FIFA World Player of the Year award three times or more, along with Zinedine Zidane and Lionel Messi. He won his first Ballon d\'Or in 1997 and won the award again in 2002.', 
        'Ronaldo Luís Nazário de Lima (locally: [ʁoˈnawðu ˈlwiʒ nɐˈzaɾju dʒ ˈɫĩmɐ]; born 18 September 1976[2]) commonly known as Ronaldo, is a retired Brazilian footballer. Popularly dubbed "the phenomenon", he is considered by experts and fans to be one of the greatest football players of all time.[3][4] He is one of only three men to have won the FIFA World Player of the Year award three times or more, along with Zinedine Zidane and Lionel Messi. He won his first Ballon d\'Or in 1997 and won the award again in 2002.',
        'Edson Arantes do Nascimento, better known as Pelé, is a retired Brazilian footballer. He is regarded by many experts, football critics, former players, current players and football fans in general as the best player of all time.',
        'Leighton John Baines is an English footballer who plays for Everton and the England national football team.'
    ];

    var images = [
        'http://elitedaily.com/wp-content/uploads/2012/03/ronaldo-brazil.jpg',
        'http://1.bp.blogspot.com/-ugwwZTIU-7c/Tbc2Q_hxHJI/AAAAAAAAAiM/Z20-1GgYRoA/s1600/Diego+Maradona%252C+Terry+Butcher+and+Kenny+Sansom+during+Argentina%25E2%2580%2599s+2-1+win+over+England+at+the+1986+World+Cup+finals+in+Mexico%252C+1986.jpg',
        'http://24.media.tumblr.com/tumblr_m2s308HJqP1qfxktpo1_1280.jpg',
        'http://24.media.tumblr.com/tumblr_m2s308HJqP1qfxktpo1_1280.jpg',
        'http://24.media.tumblr.com/tumblr_m2s308HJqP1qfxktpo1_1280.jpg',
        'http://3.bp.blogspot.com/-T6thyDdI_Sc/Uk3-9-8p3WI/AAAAAAAADhM/N3PXnErdF8o/s640/cruyff2.jpg',
        'http://24.media.tumblr.com/tumblr_m2s308HJqP1qfxktpo1_1280.jpg',
        'http://24.media.tumblr.com/tumblr_m2s308HJqP1qfxktpo1_1280.jpg',
        'http://24.media.tumblr.com/tumblr_m2s308HJqP1qfxktpo1_1280.jpg',
        'http://www.futebolfreecs.com.br/wp-content/uploads/2013/11/pele.jpg',
        'http://i3.mirror.co.uk/incoming/article854991.ece/ALTERNATES/s2197/Defenders:%20Leighton%20Baines%20(Everton%20FC)-854991'
    ];

    for (var i in players) {
        players[i].bio = bios[i];
        players[i].imageSrcLarge = images[i];
    }
    return players;

});
