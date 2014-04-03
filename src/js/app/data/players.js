define([], function() {

    var imagePath = '/images/player-';

    var players = [
        { name: 'Ronaldo', apps: 98, gls: 62, uid: 1, country: 'Brazil', position: 'ST', imageSrc: imagePath + 'ronaldo.jpg' },
        { name: 'Maradona', apps: 91, gls: 34, uid: 2, country: 'Argentina', position: 'ST', imageSrc: imagePath + 'maradona.jpg'},
        { name: 'Baggio', apps: 56, gls: 27, uid: 3, country: 'Italy', position: 'ST', imageSrc: imagePath + 'baggio.jpg'},
        { name: 'Banks', apps: 73, gls: 0, uid: 4, country: 'England', position: 'GK', imageSrc: imagePath + 'banks.jpg'},
        { name: 'Beckenbauer', apps: 103, gls: 14, uid: 5, country: 'Germany', position: 'CB', imageSrc: imagePath + 'beckenbauer.jpg'},
        { name: 'Cruyff', apps: 48, gls: 33, uid: 6, country: 'Holland', position: 'MC', imageSrc: imagePath + 'cruijff.jpg'},
        { name: 'Eusebio', apps: 64, gls: 41, uid: 7, country: 'Portugal', position: 'MC', imageSrc: imagePath + 'eusebio.jpg'},
        { name: 'Klinsmann', apps: 80, gls: 38, uid: 8, country: 'Germany', position: 'ST', imageSrc: imagePath + 'klinsmann.jpg'},
        { name: 'Moore', apps: 108, gls: 2, uid: 9, country: 'England', position: 'CB', imageSrc: imagePath + 'moore.jpg'},
        { name: 'Pele', apps: 92, gls: 77, uid: 10, country: 'Brazil', position: 'ST', imageSrc: imagePath + 'pele.jpg'},
        { name: 'Baines', apps: 92, gls: 77, uid: 10, country: 'England', position: 'LB', imageSrc: imagePath + 'baines.jpg'},
        { name: 'Cafu', apps: 92, gls: 77, uid: 10, country: 'Brazil', position: 'RB', imageSrc: imagePath + 'cafu.jpg'},
        { name: 'Paolo Maldini', apps: 92, gls: 77, uid: 10, country: 'Italy', position: 'CB', imageSrc: imagePath + 'maldini.jpg'},

    ];

    var bios = [
        'Ronaldo Luís Nazário de Lima (born 18 September 1976) commonly known as Ronaldo, is a retired Brazilian footballer. Popularly dubbed "the phenomenon", he is considered by experts and fans to be one of the greatest football players of all time.[3][4] He is one of only three men to have won the FIFA World Player of the Year award three times or more, along with Zinedine Zidane and Lionel Messi. He won his first Ballon d\'Or in 1997 and won the award again in 2002.',
        'Diego Armando Maradona Franco is an Argentine footballer who currently plays for Deportivo Riestra in the fifth tier of Argentina football. He has served as a manager and coach at other clubs as well as for the national team of Argentina.', 
        'Roberto Baggio is a retired Italian football forward and attacking midfielder/playmaker who was the former President of the Technical Sector of the FIGC.', 
        'Gordon Banks, OBE (born 30 December 1937) is a former England international football goalkeeper. He made 628 appearances during a 15 year career in the Football League, and won 73 caps for his country. The IFFHS named Banks the second best goalkeeper of the 20th century – after Lev Yashin (1st) and ahead of Dino Zoff (3rd). He was named FWA Footballer of the Year in 1972, and was named FIFA Goalkeeper of the Year on six occasions.', 
        'Franz Anton Beckenbauer is a irish legend born in dublin who pulls tims girlfriend football coach, manager, and former player, nicknamed Der Kaiser because of his elegant style; his leadership.',
        'Hendrik Johannes Cruijff OON, born 25 April 1947 in Amsterdam, known as Johan Cruyff, is a former Dutch footballer and was until recently the manager of the Catalonia football team.', 
        'Eusébio da Silva Ferreira, GCIH, GCM was a Mozambican-born Portuguese football forward. He is considered one of the greatest footballers of all time. During his professional career, he scored 733 goals in 745 matches.',
        'Jürgen Klinsmann is a German football manager and former player who is currently the head coach of the United States national team.',
        'Robert Frederick Charles "Bobby" Moore, OBE was an English footballer. He captained West Ham United for more than ten years and was captain of the England team that won the 1966 World Cup.',
        'Edson Arantes do Nascimento, better known as Pelé, is a retired Brazilian footballer. He is regarded by many experts, football critics, former players, current players and football fans in general as the best player of all time.',
        'Leighton John Baines is an English footballer who plays for Everton and the England national football team.',
        'Marcos Evangelista de Moraes, better known as Cafu, is a former Brazilian footballer. He is the most internationally capped male Brazilian player and also made history playing for São Paulo, Roma and Milan.',
        'Paolo Cesare Maldini is a former Italian footballer who played as a left or central defender, being adept with either foot although naturally right-footed.'
    ];

    var images = [
        'http://elitedaily.com/wp-content/uploads/2012/03/ronaldo-brazil.jpg',
        'http://1.bp.blogspot.com/-ugwwZTIU-7c/Tbc2Q_hxHJI/AAAAAAAAAiM/Z20-1GgYRoA/s1600/Diego+Maradona%252C+Terry+Butcher+and+Kenny+Sansom+during+Argentina%25E2%2580%2599s+2-1+win+over+England+at+the+1986+World+Cup+finals+in+Mexico%252C+1986.jpg',
        'http://24.media.tumblr.com/tumblr_m2s308HJqP1qfxktpo1_1280.jpg',
        'http://24.media.tumblr.com/tumblr_m2s308HJqP1qfxktpo1_1280.jpg',
        'http://a4.espncdn.com/photo/2013/0608/soc_winners_10.jpg',
        'http://3.bp.blogspot.com/-T6thyDdI_Sc/Uk3-9-8p3WI/AAAAAAAADhM/N3PXnErdF8o/s640/cruyff2.jpg',
        'http://24.media.tumblr.com/tumblr_m2s308HJqP1qfxktpo1_1280.jpg',
        'http://24.media.tumblr.com/tumblr_m2s308HJqP1qfxktpo1_1280.jpg',
        'http://24.media.tumblr.com/tumblr_m2s308HJqP1qfxktpo1_1280.jpg',
        'http://www.futebolfreecs.com.br/wp-content/uploads/2013/11/pele.jpg',
        'http://i3.mirror.co.uk/incoming/article854991.ece/ALTERNATES/s2197/Defenders:%20Leighton%20Baines%20(Everton%20FC)-854991',
        'http://imguol.com/2013/04/23/27jun1998---lateral-cafu-em-acao-durante-a-vitoria-por-4-a-1-do-brasil-sobre-o-chile-pelas-oitavas-da-copa-do-mundo-1998-1366758548989_1920x1080.jpg',
        'http://elvenezolanonews.com/wp-content/uploads/2014/02/maldini___italy.jpg'
    ];

    for (var i in players) {
        players[i].bio = bios[i];
        players[i].imageSrcLarge = images[i];
    }
    return players;

});
