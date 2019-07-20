let url = 'http://5d31a0174901b4001401a1cb.mockapi.io/api/ports';


let getPorts = (callback) => {
    $.get(url, res => {
        callback(res);
    })
};

let noOfSubnets = 0;
$(document).ready(() => {
    getPorts(res => {
        let sourceDataHolder = $('#source-data-holder');
        let destinationDataHolder = $('#destination-data-holder');
        res.forEach(r => {
            noOfSubnets += r.data.length;
            sourceDataHolder.append(forNodes('src', r));
            destinationDataHolder.append(forNodes('dist', r));
        });
        $('#noOfSubnets').html(noOfSubnets);

        $(function () {
            //$("#source-data-holder").draggable();
            $(".list-subnets").sortable({
                group: 'drop',
                onDragStart: function ($item, container, _super) {
                    console.log('form:',container.el[0].id);
                    _super($item, container);
                },
                onDrop: function ($item, container, _super) {
                    console.log('to:',container.el[0].id);
                    _super($item, container);
                }
            });

        });
    });

});


let showHide = (ev, id) => {
    if ($('#p-' + id).css('display') == 'block') {
        $('#p-' + id).css('display', 'none');
        ev.style.transform = 'rotate(270deg)';
    }

    else {
        $('#p-' + id).css('display', 'block');
        ev.style.transform = 'rotate(0deg)'
    }
};

let changeAllStatus = (ev, id) => {
    if (!id.indexOf('dist')) {
        dist = id;
        return
    }
    let target = ev.checked;
    $( "#p-" + id +" li" ).each(function() {
        $(this).children()[0].checked = target;
        setChecked(id.substr(4), $(this)[0].id.substr(6));
    });
};

let src = [];
let dist = '';
let setChecked = (portId, dId) => {
    src.push({port: portId, data: dId});
};

let moveSelected = () => {
    let d = $('#p-' + dist);
    if (src.length <= 0) {
        alert('Should Select Source');
        return;
    }
    if (dist == '') {
        alert('Should Select Destination');
        return;
    }

    console.log('p-' + dist);
    src.forEach(s => {
        let el = $('#p-src-'+s.port+' #d-src-' + s.data);
        el.children()[0].checked = false;
        d.append(el);
    });
    src = [];
    dist = '';
    console.log(d.children()[0].children[0].checked);
    d.children()[0].children[0].checked = false;
};


let forNodes = (prefix, r) => {
    let card = document.createElement('div');
    card.setAttribute('class', 'card');
    let cardBody = document.createElement('div');
    cardBody.setAttribute('class', 'card-body card-port-list');

    let titleList = document.createElement('ul');
    titleList.setAttribute('class', 'port-title');
    let titleListItem = document.createElement('li');

    titleListItem.innerHTML =` <i class="fa fa-sort-down collapse-arrow" onclick="showHide(this,'` + prefix + `-` + r.id +`')"></i>
                                        <input type="checkbox" onchange="changeAllStatus(this,'`+ prefix + `-` + r.id +`')">`;

    let title = document.createElement('span');
    title.setAttribute('class', 'details');
    title.innerHTML = r.port + '   <span style="color: red">' + r.data.length +'</span>';
    titleListItem.appendChild(title);
    titleList.appendChild(titleListItem);
    cardBody.appendChild(titleList);
    // list inside the port
    let dataList = document.createElement('ul');
    dataList.setAttribute('id', 'p-' + prefix + `-` + r.id);
    dataList.setAttribute('class', 'list-subnets');
    r.data.forEach(d => {
        let dataListItem = document.createElement('li');
        dataListItem.setAttribute('id','d-' + prefix + `-` + d.id);
        dataListItem.setAttribute('class', 'part');
        dataListItem.innerHTML = `<input type="checkbox" onchange="setChecked(`+r.id+`,`+d.id+`)"><div class="status s-` + d.status + `"></div>`;
        let title = document.createElement('span');
        title.setAttribute('class', 'details');
        title.innerHTML = d.subnet+ '  ' + d.name;
        dataListItem.append(title);
        dataList.append(dataListItem)
    });
    cardBody.append(dataList);
    card.appendChild(cardBody);
    return card;
};

