//processa camp de text
function processa()
{
	//borra resultats
	document.querySelector('#resultat').innerHTML="";
	//processa query per línies
	var query=document.querySelector('#textarea').value;
	if(query=="")return;
	query.split('\n').forEach(function(line)
	{
		if(line!='')
		{
			search(line);
		}
	});
}

//busca a youtube
function search(q) 
{
	var part="snippet";
	var key="AIzaSyB8SdlLvMy45YYxbXT99dUFMbDiynSC1e8";
	var url="https://www.googleapis.com/youtube/v3/search?q="+encodeURIComponent(q)+"&part="+part+"&key="+key;
	var sol=new XMLHttpRequest();
	sol.open('GET',url,true);
	sol.onreadystatechange=function() 
	{
		if(sol.readyState===XMLHttpRequest.DONE && sol.status===200) 
		{
				var list=JSON.parse(sol.responseText);

				var r=document.querySelector('#resultat');
				var div=document.createElement('div');
				r.appendChild(div);
				div.classList.add('inline');
				div.style.maxWidth="49%";
				div.style.margin="0 0.5em 0.5em 0";

				//paraules buscades
				var cerca=document.createElement('div');
				div.appendChild(cerca)
				cerca.innerHTML="<b title='"+q+"'>"+q.substring(0,30)+"</b> &emsp;";

				//botó per fer apareixer el select
				var button=document.createElement('button');
				cerca.appendChild(button);
				button.innerHTML="&#8644;"

				var select=creaSelect(list);
				select.style.display='none';
				select.style.margin='0.5em 0';
				div.appendChild(select);

				//toggle display
				button.onclick=function(){
					select.style.display=select.style.display=='none'?"block":"none";
				}

				var iframe=creaVideo(list.items[0].id.videoId);
				div.appendChild(iframe);

				select.onchange=function()
				{
					iframe.src="https://www.youtube.com/embed/"+select.value;
					select.style.display='none';
				}
		}
	};
	sol.send();
}

//crea un select a partir d'una list de l'api youtube
function creaSelect(list)
{
	//crea un menu per la resta de resultats
	var select=document.createElement('select');
	select.style.display='block';
	list.items.forEach(function(item)
	{
		var id    = item.id.videoId;
		var canal = item.snippet.channelTitle;
		var titol = item.snippet.title;
		//new option
		var option=document.createElement('option');
		select.appendChild(option)
		option.value=id;
		var text=canal+": "+titol;
		if(text.length>=47) text=text.substring(0,44)+"...";
		option.innerHTML=text;
	});
	return select;
}

function creaVideo(id)
{
	var iframe=document.createElement('iframe');
	iframe.src="https://www.youtube.com/embed/"+id+"";
	iframe.setAttribute('height',130);
	iframe.setAttribute('width',300);
	iframe.setAttribute('frameborder',0);
	iframe.setAttribute('allowfullscreen',1);
	return iframe;
}
