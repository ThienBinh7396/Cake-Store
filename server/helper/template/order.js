const helper = require("../helper");

class Order {
  _renderCartRow = (_cart, index) => {
    let { amount } = _cart;
    let product = _cart.product_detail;

    return `
		<div style="background-color:transparent;">
		<div class="block-grid three-up" style="Margin: 0 auto; min-width: 320px; max-width: 620px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: transparent;">
			<div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
				<!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:620px"><tr class="layout-full-width" style="background-color:transparent"><![endif]-->
				<!--[if (mso)|(IE)]><td align="center" width="206" style="background-color:transparent;width:206px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;"><![endif]-->
				<div class="col num3" style="max-width: 320px; min-width: 155px; display: table-cell; vertical-align: top; width: 206px;">
					<div style="width:100% !important;">
						<!--[if (!mso)&(!IE)]><!-->
						<div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
							<!--<![endif]-->
							<div class="img-container center autowidth" align="left" style="padding-right: 0px;padding-left: 0px;">
								<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr style="line-height:0px"><td style="padding-right: 0px;padding-left: 0px;" align="center"><![endif]--><img class="center autowidth" align="center" border="0" src="${
                  product.thumbnail
                }" alt="Image" title="Image" style="text-decoration: none; -ms-interpolation-mode: bicubic; border: 0; height: auto; width: 68px; max-width: 100%; margin-left: 20px; display: block;" width="206">
								<!--[if mso]></td></tr></table><![endif]-->
							</div>
							<!--[if (!mso)&(!IE)]><!-->
						</div>
						<!--<![endif]-->
					</div>
				</div>
				<!--[if (mso)|(IE)]></td></tr></table><![endif]-->
				<!--[if (mso)|(IE)]></td><td align="center" width="206" style="background-color:transparent;width:206px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;"><![endif]-->
				<div class="col num6" style="max-width: 320px; min-width: 310px; display: table-cell; vertical-align: middle; width: 206px;">
					<div style="width:100% !important;">
						<!--[if (!mso)&(!IE)]><!-->
						<div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
							<!--<![endif]-->
							<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 20px; padding-left: 20px; padding-top: 10px; padding-bottom: 10px; font-family: Tahoma, Verdana, sans-serif"><![endif]-->
							<div style="color:#000000;font-family:Lato, Tahoma, Verdana, Segoe, sans-serif;line-height:1.2;padding-top:10px;padding-right:20px;padding-bottom:10px;padding-left:20px;">
								<div style="font-size: 12px; line-height: 1.2; color: #000000; font-family: Lato, Tahoma, Verdana, Segoe, sans-serif; mso-line-height-alt: 14px;">
									<p style="font-size: 14px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 17px; margin: 0;">${amount} x ${
      product.title.length > 54
        ? product.title.substring(0, 54) + "..."
        : product.title
    } #${index}</p>
								</div>
							</div>
							<!--[if mso]></td></tr></table><![endif]-->
							<!--[if (!mso)&(!IE)]><!-->
						</div>
						<!--<![endif]-->
					</div>
				</div>
				<!--[if (mso)|(IE)]></td></tr></table><![endif]-->
				<!--[if (mso)|(IE)]></td><td align="center" width="206" style="background-color:transparent;width:206px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;"><![endif]-->
				<div class="col num3" style="max-width: 320px; min-width: 155px; display: table-cell; vertical-align: middle; width: 206px;">
					<div style="width:100% !important;">
						<!--[if (!mso)&(!IE)]><!-->
						<div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
							<!--<![endif]-->
							<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 20px; padding-left: 20px; padding-top: 10px; padding-bottom: 10px; font-family: Tahoma, Verdana, sans-serif"><![endif]-->
							<div style="color:#000000;font-family:Lato, Tahoma, Verdana, Segoe, sans-serif;line-height:1.2;padding-top:10px;padding-right:20px;padding-bottom:10px;padding-left:20px;">
								<div style="font-size: 12px; line-height: 1.2; color: #000000; font-family: Lato, Tahoma, Verdana, Segoe, sans-serif; mso-line-height-alt: 14px;">
									<p style="font-size: 14px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 17px; margin: 0;">$${(
                    amount *
                    ((100 - product.discount) / 100) *
                    product.price
                  ).toFixed(2)}</p>
								</div>
							</div>
							<!--[if mso]></td></tr></table><![endif]-->
							<!--[if (!mso)&(!IE)]><!-->
						</div>
						<!--<![endif]-->
					</div>
				</div>
				<!--[if (mso)|(IE)]></td></tr></table><![endif]-->
				<!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
			</div>
		</div>
	</div>
		
		`;
  };

  _renderCartHtml = cart => {
    let html = cart.reduce((_html, current, currentIndex) => {
      return `${_html} ${this._renderCartRow(current, currentIndex + 1)}`;
    }, "");

    return html;
  };

  renderOrderConfirmHtml({ customer, cart, address_delivery, payment_info, order_code }) {
    let now = helper.formatDate(Date.now(), 6);

    let total = cart
      .reduce(
        (_total, current) => _total + current.amount * current.current_price,
        0
      )
      .toFixed(2);

    let _addressDelivery = address_delivery
      ? `${
          address_delivery.address.trim().length !== 0
            ? address_delivery.address + ", "
            : ""
        }${address_delivery.commune &&
          address_delivery.commune.name +
            " commune, "}${address_delivery.district &&
          address_delivery.district.name +
            " district, "}${address_delivery.city &&
          address_delivery.city.name + " city, "}`
      : "";

    let template = `
		<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
		<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
		
		<head>
			<!--[if gte mso 9]><xml><o:OfficeDocumentSettings><o:AllowPNG/><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml><![endif]-->
			<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
			<meta name="viewport" content="width=device-width">
			<!--[if !mso]><!-->
			<meta http-equiv="X-UA-Compatible" content="IE=edge">
			<!--<![endif]-->
			<title></title>
			<!--[if !mso]><!-->
			<link href="https://fonts.googleapis.com/css?family=Lato" rel="stylesheet" type="text/css">
			<!--<![endif]-->
			<style type="text/css">
				body {
					margin: 0;
					padding: 0;
				}
		
				table,
				td,
				tr {
					vertical-align: top;
					border-collapse: collapse;
				}
		
				* {
					line-height: inherit;
				}
		
				a[x-apple-data-detectors=true] {
					color: inherit !important;
					text-decoration: none !important;
				}
				.block-grid{
					background-color: #fff !important;
				}
			</style>
			<style type="text/css" id="media-query">
				@media (max-width: 640px) {

					.block-grid,
					.col {
						min-width: 320px !important;
						max-width: 100% !important;
						display: block !important;
					}
		
					.block-grid {
						width: 100% !important;
					}
		
					.col {
						width: 100% !important;
					}
		
					.col>div {
						margin: 0 auto;
					}
		
					img.fullwidth,
					img.fullwidthOnMobile {
						max-width: 100% !important;
					}
		
					.no-stack .col {
						min-width: 0 !important;
						display: table-cell !important;
					}
		
					.no-stack.two-up .col {
						width: 50% !important;
					}
		
					.no-stack .col.num4 {
						width: 33% !important;
					}
		
					.no-stack .col.num8 {
						width: 66% !important;
					}
		
					.no-stack .col.num4 {
						width: 33% !important;
					}
		
					.no-stack .col.num3 {
						width: 25% !important;
					}
		
					.no-stack .col.num6 {
						width: 50% !important;
					}
		
					.no-stack .col.num9 {
						width: 75% !important;
					}
		
					.video-block {
						max-width: none !important;
					}
		
					.mobile_hide {
						min-height: 0px;
						max-height: 0px;
						max-width: 0px;
						display: none;
						overflow: hidden;
						font-size: 0px;
					}
		
					.desktop_hide {
						display: block !important;
						max-height: none !important;
					}
				}
			</style>
		</head>
		
		<body class="clean-body" style="margin: 0; padding: 16px; -webkit-text-size-adjust: 100%; background-color: #F2F2F2;">
			<!--[if IE]><div class="ie-browser"><![endif]-->
			<table class="nl-container" style="table-layout: fixed; vertical-align: top; min-width: 320px; Margin: 0 auto; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: transparent; width: 100%;" cellpadding="0" cellspacing="0" role="presentation" width="100%" bgcolor="#FFFFFF" valign="top">
				<tbody>
					<tr style="vertical-align: top;" valign="top">
						<td style="word-break: break-word; vertical-align: top;" valign="top">
							<!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color:transparent"><![endif]-->
							<div style="background-color:transparent;">
								<div class="block-grid two-up" style="Margin: 0 auto; min-width: 320px; max-width: 620px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: transparent;border-bottom: 1px solid;">
									<div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
										<!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:620px"><tr class="layout-full-width" style="background-color:transparent"><![endif]-->
										<!--[if (mso)|(IE)]><td align="center" width="310" style="background-color:transparent;width:310px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top:5px; padding-bottom:5px;"><![endif]-->
										<div class="col num6" style="max-width: 320px; min-width: 310px; display: table-cell; vertical-align: top; width: 310px;">
											<div style="width:100% !important;">
												<!--[if (!mso)&(!IE)]><!-->
												<div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 10px; padding-left: 10px;">
													<!--<![endif]-->
													<div class="img-container left" align="left" style="padding-right: 0px;padding-left: 0px;">
														<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr style="line-height:0px"><td style="padding-right: 0px;padding-left: 0px;" align="left"><![endif]-->
														<img class="left" border="0" src="https://d15k2d11r6t6rl.cloudfront.net/public/users/Integrators/BeeProAgency/529713_510574/Screenshot_14_1.png" alt="Image" title="Image" style="text-decoration: none; -ms-interpolation-mode: bicubic; border: 0; height: auto; width: 100%; max-width: 185px; display: block;" width="185">
														<!--[if mso]></td></tr></table><![endif]-->
													</div>
													<!--[if (!mso)&(!IE)]><!-->
												</div>
												<!--<![endif]-->
											</div>
										</div>
										<!--[if (mso)|(IE)]></td></tr></table><![endif]-->
										<!--[if (mso)|(IE)]></td><td align="center" width="310" style="background-color:transparent;width:310px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top:5px; padding-bottom:5px;"><![endif]-->
										<div class="col num6" style="max-width: 320px; min-width: 310px; display: table-cell; vertical-align: top; width: 310px;">
											<div style="width:100% !important;">
												<!--[if (!mso)&(!IE)]><!-->
												<div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 10px; padding-left: 10px;">
													<!--<![endif]-->
													<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top: 15px; padding-bottom: 15px; font-family: 'Times New Roman', Georgia, serif"><![endif]-->
													<div style="color:#555555;font-family:TimesNewRoman, 'Times New Roman', Times, Baskerville, Georgia, serif;line-height:1.2;padding-top:15px;padding-right:0px;padding-bottom:15px;padding-left:0px;">
														<div style="font-size: 12px; line-height: 1.2; font-family: TimesNewRoman, 'Times New Roman', Times, Baskerville, Georgia, serif; color: #555555; mso-line-height-alt: 14px;">
															<p style="font-size: 14px; line-height: 1.2; text-align: right; word-break: break-word; font-family: TimesNewRoman, 'Times New Roman', Times, Baskerville, Georgia, serif; mso-line-height-alt: 17px; margin: 0;padding-right: 20px"><em>${
                                now.format
                              }</em><br></p>
														</div>
													</div>
													<!--[if mso]></td></tr></table><![endif]-->
													<!--[if (!mso)&(!IE)]><!-->
												</div>
												<!--<![endif]-->
											</div>
										</div>
										<!--[if (mso)|(IE)]></td></tr></table><![endif]-->
										<!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
									</div>
								</div>
							</div>
						
							<div style="background-color:transparent;">
								<div class="block-grid " style="Margin: 0 auto; min-width: 320px; max-width: 620px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: transparent;">
									<div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
										<!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:620px"><tr class="layout-full-width" style="background-color:transparent"><![endif]-->
										<!--[if (mso)|(IE)]><td align="left" width="620" style="background-color:transparent;width:620px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:10px;"><![endif]-->
										<div class="col num12" style="min-width: 320px; max-width: 620px; display: table-cell; vertical-align: top; width: 620px;">
											<div style="width:100% !important;">
												<!--[if (!mso)&(!IE)]><!-->
												<div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:10px; padding-right: 0px; padding-left: 0px;">
													<!--<![endif]-->
													<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Tahoma, Verdana, sans-serif"><![endif]-->
													
													<!--[if mso]></td></tr></table><![endif]-->
													<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 5px; font-family: Tahoma, Verdana, sans-serif"><![endif]-->
													<div style="color:#000000;font-family:Lato, Tahoma, Verdana, Segoe, sans-serif;line-height:1.2;padding-top:10px;padding-right:20px;padding-bottom:0;padding-left:20px;">
														<div style="font-size: 12px; line-height: 1.2; color: #333; font-family: Lato, Tahoma, Verdana, Segoe, sans-serif; mso-line-height-alt: 14px;">
															<p style="font-size: 14px; line-height: 1.2; text-align: left; word-break: break-word; mso-line-height-alt: 17px; margin: 0;"><strong style="font-family: Lato, Tahoma, Verdana, Segoe, sans-serif; background-color: transparent;"><span style="font-size: 18px;">Hi, ${
                                customer.name
                              }. Your order with code <u>${order_code}</u> has been sent to admin!</span></strong></p>
														</div>
													</div>
													<div style="color:#333;font-family:Lato, Tahoma, Verdana, Segoe, sans-serif;line-height:1.2;padding-top:10px;padding-right:20px;padding-bottom:25px;padding-left:20px;">
														<div style="font-size: 12px; line-height: 1.2; font-family: Lato, Tahoma, Verdana, Segoe, sans-serif; color: #333; mso-line-height-alt: 14px;">
															<div style="display: flex; width: 100%; flex-wrap: wrap">
																<div class="block-grid" style="width: 60%">
																	<ul style="padding: 0; margin: 0; list-style: none">
																		<li style="padding: 0; margin: 0; list-style: none"><strong>Payment information</strong></li>
																		<li style="padding: 0; padding-top: 6px; margin: 0; list-style: none">${
                                      customer.name
                                    }</li>
																		<li style="padding: 0; padding-top: 6px; margin: 0; list-style: none">${
                                      customer.email
                                    }</li>
																		<li style="padding: 0; padding-top: 6px; margin: 0; list-style: none">${
                                      customer.phone
                                    }</li>
																	</ul>
																</div>
																<div class="block-grid" style="width: 60%">
																	<ul style="padding: 0; margin: 0; list-style: none">
																		<li style="padding: 0; padding-top: 6px; margin: 0; list-style: none"><strong>Address delivery</strong></li>
																		<li style="padding: 0; padding-top: 6px; margin: 0; list-style: none">${_addressDelivery}</li>
																		<li style="padding: 0; padding-top: 6px; margin: 0; list-style: none">${
                                      customer.phone
                                    }</li>
																	</ul>
																</div>
															</div>		
															<div class="block-grid " style="margin-top: 24px">
																<strong>Payment method: </strong>${payment_info.title}.
															</div>											
														</div>
													</div>
												</div>
												<!--<![endif]-->
											</div>
										</div>
										<!--[if (mso)|(IE)]></td></tr></table><![endif]-->
										<!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
									</div>
								</div>
							</div>
							<div style="background-color:transparent;">
								<div class="block-grid three-up no-stack" style="Margin: 0 auto; min-width: 320px; max-width: 620px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: #e47277;">
									<div style="border-collapse: collapse;display: table;width: 100%;background-color:#e47277;">
										<!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:620px"><tr class="layout-full-width" style="background-color:#e47277"><![endif]-->
										<!--[if (mso)|(IE)]><td align="center" width="206" style="background-color:#e47277;width:206px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;"><![endif]-->
										<div class="col num3" style="max-width: 320px; min-width: 155px; display: table-cell; vertical-align: top; width: 155px;">
											<div style="width:100% !important;">
												<!--[if (!mso)&(!IE)]><!-->
												<div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
													<!--<![endif]-->
													<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Tahoma, Verdana, sans-serif"><![endif]-->
													<div style="color:#FFFFFF;font-family:Lato, Tahoma, Verdana, Segoe, sans-serif;line-height:1.2;padding-top:10px;padding-right:20px;padding-bottom:10px;padding-left:20px;">
														<div style="font-size: 12px; line-height: 1.2; color: #FFFFFF; font-family: Lato, Tahoma, Verdana, Segoe, sans-serif; mso-line-height-alt: 14px;">
															<p style="font-size: 14px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 17px; margin: 0;"><span style="font-size: 14px;">THUMBNAIL</span></p>
														</div>
													</div>
													<!--[if mso]></td></tr></table><![endif]-->
													<!--[if (!mso)&(!IE)]><!-->
												</div>
												<!--<![endif]-->
											</div>
										</div>
										<!--[if (mso)|(IE)]></td></tr></table><![endif]-->
										<!--[if (mso)|(IE)]></td><td align="center" width="206" style="background-color:#e47277;width:206px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;"><![endif]-->
										<div class="col num6" style="max-width: 320px; min-width: 310px; display: table-cell; vertical-align: top; width: 206px;">
											<div style="width:100% !important;">
												<!--[if (!mso)&(!IE)]><!-->
												<div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
													<!--<![endif]-->
													<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 20px; padding-left: 20px; padding-top: 10px; padding-bottom: 10px; font-family: Tahoma, Verdana, sans-serif"><![endif]-->
													<div style="color:#FFFFFF;font-family:Lato, Tahoma, Verdana, Segoe, sans-serif;line-height:1.2;padding-top:10px;padding-right:20px;padding-bottom:10px;padding-left:20px;">
														<div style="font-size: 12px; line-height: 1.2; color: #FFFFFF; font-family: Lato, Tahoma, Verdana, Segoe, sans-serif; mso-line-height-alt: 14px;">
															<p style="font-size: 14px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 17px; margin: 0;">PRODUCTS</p>
														</div>
													</div>
													<!--[if mso]></td></tr></table><![endif]-->
													<!--[if (!mso)&(!IE)]><!-->
												</div>
												<!--<![endif]-->
											</div>
										</div>
										<!--[if (mso)|(IE)]></td></tr></table><![endif]-->
										<!--[if (mso)|(IE)]></td><td align="center" width="206" style="background-color:#e47277;width:206px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;"><![endif]-->
										<div class="col num3" style="max-width: 320px; min-width: 155px; display: table-cell; vertical-align: top; width: 206px;">
											<div style="width:100% !important;">
												<!--[if (!mso)&(!IE)]><!-->
												<div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
													<!--<![endif]-->
													<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 20px; padding-left: 20px; padding-top: 10px; padding-bottom: 10px; font-family: Tahoma, Verdana, sans-serif"><![endif]-->
													<div style="color:#FFFFFF;font-family:Lato, Tahoma, Verdana, Segoe, sans-serif;line-height:1.2;padding-top:10px;padding-right:20px;padding-bottom:10px;padding-left:20px;">
														<div style="font-size: 12px; line-height: 1.2; color: #FFFFFF; font-family: Lato, Tahoma, Verdana, Segoe, sans-serif; mso-line-height-alt: 14px;">
															<p style="font-size: 14px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 17px; margin: 0;"><span style="font-size: 14px;">PRICE</span><br></p>
														</div>
													</div>
													<!--[if mso]></td></tr></table><![endif]-->
													<!--[if (!mso)&(!IE)]><!-->
												</div>
												<!--<![endif]-->
											</div>
										</div>
										<!--[if (mso)|(IE)]></td></tr></table><![endif]-->
										<!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
									</div>
								</div>
							</div>
							${this._renderCartHtml(cart)}
							<div style="background-color:transparent;">
								<div class="block-grid  no-stack" style="Margin: 0 auto; min-width: 320px; max-width: 620px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: transparent;">
									<div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
										<!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:620px"><tr class="layout-full-width" style="background-color:transparent"><![endif]-->
										<!--[if (mso)|(IE)]><td align="center" width="620" style="background-color:transparent;width:620px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;"><![endif]-->
										<div class="col num12" style="min-width: 320px; max-width: 620px; display: table-cell; vertical-align: top; width: 620px;">
											<div style="width:100% !important;">
												<!--[if (!mso)&(!IE)]><!-->
												<div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
													<!--<![endif]-->
													<table class="divider" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" role="presentation" valign="top">
														<tbody>
															<tr style="vertical-align: top;" valign="top">
																<td class="divider_inner" style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px;" valign="top">
																	<table class="divider_content" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 1px dotted #CCCCCC; width: 100%;" align="center" role="presentation" valign="top">
																		<tbody>
																			<tr style="vertical-align: top;" valign="top">
																				<td style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top"><span></span></td>
																			</tr>
																		</tbody>
																	</table>
																</td>
															</tr>
														</tbody>
													</table>
													<!--[if (!mso)&(!IE)]><!-->
												</div>
												<!--<![endif]-->
											</div>
										</div>
										<!--[if (mso)|(IE)]></td></tr></table><![endif]-->
										<!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
									</div>
								</div>
							</div>
							<div style="background-color:transparent;">
								<div class="block-grid mixed-two-up  no-stack" style="Margin: 0 auto; min-width: 320px; max-width: 620px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: #FFFFFF; padding-bottom: 24px; border-bottom: 1px dotted #cccccc">
									<div style="border-collapse: collapse;display: table;width: 100%;background-color:#FFFFFF;">
										<!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:620px"><tr class="layout-full-width" style="background-color:#FFFFFF"><![endif]-->
										<!--[if (mso)|(IE)]><td align="center" width="413" style="background-color:#FFFFFF;width:413px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:0px;"><![endif]-->
										<div class="col num9" style="display: table-cell; vertical-align: top; min-width: 320px; max-width: 465px; width: 465px;">
											<div style="width:100% !important;">
												<!--[if (!mso)&(!IE)]><!-->
												<div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;">
													<!--<![endif]-->
													<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 20px; padding-left: 20px; padding-top: 5px; padding-bottom: 5px; font-family: Tahoma, Verdana, sans-serif"><![endif]-->
													<div style="color:#000000;font-family:Lato, Tahoma, Verdana, Segoe, sans-serif;line-height:1.2;padding-top:5px;padding-right:20px;padding-bottom:5px;padding-left:20px;">
														<div style="font-size: 12px; line-height: 1.2; color: #000000; font-family: Lato, Tahoma, Verdana, Segoe, sans-serif; mso-line-height-alt: 14px;">
															<p style="font-size: 14px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 17px; margin: 0;"><strong>TOTAL</strong><br></p>
														</div>
													</div>
													<!--[if mso]></td></tr></table><![endif]-->
													<!--[if (!mso)&(!IE)]><!-->
												</div>
												<!--<![endif]-->
											</div>
										</div>
										<!--[if (mso)|(IE)]></td></tr></table><![endif]-->
										<!--[if (mso)|(IE)]></td><td align="center" width="206" style="background-color:#FFFFFF;width:206px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:0px;"><![endif]-->
										<div class="col num3" style="display: table-cell; vertical-align: top; max-width: 155px; min-width: 155px; width: 206px; padding-left: 20px">
											<div style="width:100% !important;">
												<!--[if (!mso)&(!IE)]><!-->
												<div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;">
													<!--<![endif]-->
													<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 20px; padding-left: 20px; padding-top: 5px; padding-bottom: 5px; font-family: Tahoma, Verdana, sans-serif"><![endif]-->
													<div style="color:#000000;font-family:Lato, Tahoma, Verdana, Segoe, sans-serif;line-height:1.2;padding-top:5px;padding-right:20px;padding-bottom:5px;padding-left:20px;">
														<div style="font-size: 12px; line-height: 1.2; color: #000000; font-family: Lato, Tahoma, Verdana, Segoe, sans-serif; mso-line-height-alt: 14px;">
															<p style="font-size: 14px; line-height: 1.2; word-break: break-word; mso-line-height-alt: 17px; margin: 0;"><strong>$${total}</strong></p>
														</div>
													</div>
													<!--[if mso]></td></tr></table><![endif]-->
													<!--[if (!mso)&(!IE)]><!-->
												</div>
												<!--<![endif]-->
											</div>
										</div>
										<!--[if (mso)|(IE)]></td></tr></table><![endif]-->
										<!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
									</div>
								</div>
							</div>
			
							<div style="background-color:transparent;">
								<div class="block-grid " style="Margin: 0 auto; min-width: 320px; max-width: 620px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; background-color: transparent;">
									<div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
										<!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:620px"><tr class="layout-full-width" style="background-color:transparent"><![endif]-->
										<!--[if (mso)|(IE)]><td align="center" width="620" style="background-color:transparent;width:620px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;"><![endif]-->
										<div class="col num12" style="min-width: 320px; max-width: 620px; display: table-cell; vertical-align: top; width: 620px;">
											<div style="width:100% !important;">
												<!--[if (!mso)&(!IE)]><!-->
												<div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
													<!--<![endif]-->
													<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Tahoma, Verdana, sans-serif"><![endif]-->
													<div style="color:#555555;font-family:Lato, Tahoma, Verdana, Segoe, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
														<div style="font-size: 12px; line-height: 1.2; font-family: Lato, Tahoma, Verdana, Segoe, sans-serif; color: #555555; mso-line-height-alt: 14px;">
															<p style="font-size: 12px; line-height: 1.2; text-align: center; word-break: break-word; font-family: Lato, Tahoma, Verdana, Segoe, sans-serif; mso-line-height-alt: 14px; margin: 0;"><span style="font-size: 12px;">Copyright © ${new Date().getFullYear()} Mailup Inc.&nbsp;All rights reserved.&nbsp;</span><br></p>
														</div>
													</div>
													<!--[if mso]></td></tr></table><![endif]-->
													<!--[if (!mso)&(!IE)]><!-->
												</div>
												<!--<![endif]-->
											</div>
										</div>
										<!--[if (mso)|(IE)]></td></tr></table><![endif]-->
										<!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
									</div>
								</div>
							</div>
							<!--[if (mso)|(IE)]></td></tr></table><![endif]-->
						</td>
					</tr>
				</tbody>
			</table>
			<!--[if (IE)]></div><![endif]-->
		</body>
		
		</html>`;

    return template;
  }
}

module.exports = new Order();
