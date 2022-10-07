import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router'
import { CookieService } from 'ngx-cookie-service'
import { Observable } from 'rxjs'
import { MainPageComponent } from '../components/main-page/main-page.component'

@Injectable({
	providedIn: 'root',
})
export class IsLoggedInGuard implements CanActivate {
	constructor(private cookieService: CookieService) {}
	canActivate(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
		return this.cookieService.get('isLoggedIn') === 'true'
	}
}
