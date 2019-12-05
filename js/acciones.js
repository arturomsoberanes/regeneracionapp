//JavaScript Document

$(document).ready(function(e){
var servidor = $('#ipservidor').val();
var citas = [];
var idcita="";
var servicio="";
var fecha="";
var hora="";
var cita="";	

var respuesta = 0;

var idUsuario=0;
	
	function buscarcitas(idusuario)
		{
			$('.contenedor-citas').empty();

			$.when($.post("http://" + servidor + "/regeneracion/buscarcitas.php",{quien: idusuario})).then(
				function exito(datos) {			
					citas = JSON.parse(datos);					
					for (var i=0; i<citas.length; i++)
						{
							servicio = citas[i].areaReservacion;
							fecha = citas[i].fechaReservacion;
							hora = citas[i].horaReservacion;
							idcita = citas[i].idReservacion;
							cita = `<div class="cita"><div class="ui-grid-solo datos-cita"><div class="fecha"><span class="cita-fecha">${fecha}</span><span class="cita-hora">${hora}</span></div><h3 class="cita-servicio">${servicio}</h3></div><div class="ui-grid-a"><div class="ui-block-a"><a href="#" class="ui-btn ui-btn-corner-all ui-btn-icon-left ui-icon-edit ui-nodisc-icon acciones" data-value="${idcita}">Modificar</a></div>	<div class="ui-block-b"><a href="#" class="ui-btn ui-btn-corner-all ui-btn-icon-left ui-icon-delete ui-nodisc-icon acciones" data-value="${idcita}">Eliminar</a></div></div></div>`
							$('.contenedor-citas').append(cita);														
						}
                   if (clave=="Nocitas")
				{
					$('.contenedor-citas').empty();
				$('.contenedor-citas').append(valor);		
				}
					//$('.contenedor-citas').enhanceWithin();
					$('.acciones').trigger('create');
				},
			function error() {
				alert ("No hay respuesta del servidor");
			});
		}
	
	$('#enviar').on('click', function() {
		if (($('#usuario').val()!="") && ($('#pass').val()!= "") )
			{
				$.when($.post("http://" + servidor + "/regeneracion/verificarusuario.php",{usuario: $('#usuario').val(), password:$('#pass').val() })).then(
					function exito(datos) {
						var c=0;
						JSON.parse(datos, function(clave, valor){
							if(clave == "Error")
								{									
									alert (valor);
									$('#usuario').focus();
								}
							else if(clave == "idUsuario")							
								{
									idUsuario = valor;
									$.when(buscarcitas(valor));
								}
							else if (clave == "nombreUsuario")
								{
									$('#nombre-usuario').html(valor.toUpperCase());
								}
							else if (clave == "acceso")
								{
									respuesta = valor;
								}							
						});
						if (respuesta > 0)
							{
								$.mobile.changePage("#citas", {transition: "slidedown", changeHash: false});
							}
					},
					function error() {
						alert ("Error en el envio de informacion");
					});
			}
		else
			{
				alert ("debes llenar los campos");
				$('#usuario').focus();
			}
	});
	
	$(document).on('click', '.acciones', function(){
		if ($(this).html() == "Eliminar")
		 {
			$.when($.post("http://" + servidor + "/regeneracion/eliminarcita.php",{cual: $(this).attr('data-value')})).then(
			function exito(datos){
			JSON.parse(datos, function(clave, valor){
			if(clave == "Error")
				{									
					alert (valor);									
				}
			else if (clave == "Exito")
				{
					alert (valor + "->" + idUsuario);
					buscarcitas(idUsuario);
				}
			
			});
		 },
		 function error()
		 {
			 		alert ("No se puede alcanzar el servidor");										 
		 });
	 }
	else if ($(this).html() == "Modificar")
		{
			alert ("Modificar cita" + $(this).attr('data-value'));
		}		
	});
	
	$('#ipservidor').on('change', function(){		
		servidor = $(this).val();
	});
});