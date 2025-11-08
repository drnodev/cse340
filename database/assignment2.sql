
INSERT INTO public.account
			(account_firstname, account_lastname, account_email, account_password)
	VALUES  ('Tony', 'Stark', 'tony@starkent.com','Iam1ronM@n');



UPDATE public.account 
	 set account_type = 'Admin'::account_type  where account_id = 1;


DELETE from public.account where account_id = 1;



update public.inventory 
set inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
where inv_id = 10;


select i.inv_make, i.inv_model, c.classification_name 
from public.inventory i 
inner join public.classification c on i.classification_id = c.classification_id;



update public.inventory 
set inv_image       = REPLACE(inv_image,     '/images/','/images/vehicles/') ,
 	inv_thumbnail   = REPLACE (inv_thumbnail, '/images/','/images/vehicles/') ;

