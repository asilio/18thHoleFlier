const sin = Math.sin;
const cos = Math.cos;
const PI = Math.PI;
const pow = Math.pow;
const sqrt = Math.sqrt;
/*
Draw an isoplane rotated at a given angle, centered at desired viewport
*/

function euclidean_metric(x,y){
	return sqrt(pow(x,2)+pow(y,2));
}
function isoplanar_point_to_screen_at_angle(point,angle,center_x=0,center_y=0,horizontal_length = 10, vertical_length = 10, unit_length=1){
	return [
		center_x+(point[0]-point[1])*unit_length,
		center_y+unit_length*(point[0]+point[1])*sin(angle)
		];
}

function isoplanar_point_to_screen_90_degree_rotation_of_grid(point,angle, center_x=0, center_y=0, horizontal_length=10, vertical_length=10, unit_length = 64){
	//point is relative to the un-rotated grid, not the screen
	let pointA = [
		-point[1] + unit_length*(vertical_length+horizontal_length)/2,
		point[0] + unit_length*(vertical_length-horizontal_length)/2
		];

	return isoplanar_point_to_screen_at_angle(pointA, angle, center_x, center_y, unit_length);
}

function draw_line(context,x1,y1,x2,y2){
	context.beginPath();
	context.moveTo(x1,y1);
	context.lineTo(x2,y2);
	context.stroke();
	context.closePath();
}
function draw_isoplane_at_angle(context, angle, center_x = 0,center_y = 0, horizontal_length=10, vertical_length=10, unit_length=64){
	
	//Transform function, maybe an actual paramater?
	let transform = isoplanar_point_to_screen_90_degree_rotation_of_grid;

	let bottom_middle = transform([horizontal_length,vertical_length],angle,center_x,center_y,horizontal_length, vertical_length,unit_length);
	for(let x_hat = 0;x_hat<=horizontal_length;x_hat++){
		let root =transform([x_hat,0],angle,center_x,center_y,horizontal_length,vertical_length, unit_length);
		let top = transform([x_hat,vertical_length],angle,center_x,center_y,horizontal_length, vertical_length, unit_length);
		draw_line(context,root[0],root[1],top[0],top[1]);
		let bottom = [top[0],top[1]+unit_length/cos(angle)];
		draw_line(context,top[0],top[1],bottom[0],bottom[1]);
		if(x_hat == 0){
			draw_line(context,bottom[0],bottom[1],bottom_middle[0],bottom_middle[1]+unit_length/cos(angle));
		}
		/*
		for(let y_hat = 0;y_hat<vertical_length;y_hat++){
			let x,y;
			[x,y] = isoplanar_point_to_screen_at_angle([x_hat,y_hat],angle,center_x,center_y,unit_length);
			context.strokeRect(x,y,1,1);
		}
		*/
	}

	for(let y_hat = 0; y_hat <=vertical_length; y_hat++){
		let root =transform([0,y_hat],angle,center_x,center_y,horizontal_length, vertical_length,unit_length);
		let top = transform([horizontal_length,y_hat],angle,center_x,center_y,horizontal_length, vertical_length,unit_length);
		draw_line(context,root[0],root[1],top[0],top[1]);
		let bottom = [top[0],top[1]+unit_length/cos(angle)];
		draw_line(context,top[0],top[1],bottom[0],bottom[1]);
		if(y_hat == 0){
			draw_line(context,bottom[0],bottom[1],bottom_middle[0],bottom_middle[1]+unit_length/cos(angle));
		}
	}
}
/*
const canvas = document.getElementById('canvas2');
const context = canvas.getContext('2d');

draw_isoplane_at_angle(context,PI/6,canvas.width/2,0,10,10,32)
*/

export {draw_isoplane_at_angle};