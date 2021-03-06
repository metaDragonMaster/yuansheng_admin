import router from './router';
import store from './store';
import {
	Message
} from 'element-ui';
import NProgress from 'nprogress'; // progress bar
import 'nprogress/nprogress.css'; // progress bar style
import {
	getToken
} from '@/utils/auth'; // get token from cookie
import getPageTitle from '@/utils/get-page-title';

NProgress.configure({
	showSpinner: false
});

const whiteList = ['/login', '/auth-redirect', '/404'];

router.beforeEach(async (to, from, next) => {
	NProgress.start()
	document.title = getPageTitle(to.meta.title);
	const hasToken = getToken();
	// console.log(hasToken)
	if (hasToken) {
		if (to.path === '/login') {
			next({path: '/'});
			NProgress.done();
		} else {
			// const hasRoles = store.getters.roles && store.getters.roles.length > 0
			// if (hasRoles) {
			if (router.isAdded) { //判断是否添加过了
				next();
			} else {
				// console.log('有token')
				try {
					const getInfo = await store.dispatch('user/getInfo');
					console.log(getInfo)
					// let {routerList} = getInfo.data;
					// const accessRoutes = await store.dispatch('permission/generateRoutes', routerList);
					const accessRoutes = await store.dispatch('permission/generateRoutes');
					// console.log("accessRoutes",accessRoutes)
					router.addRoutes(accessRoutes);
					router.isAdded = true;
					// console.log("添加完成后的router",router)
					next({ ...to, replace: true });
				} catch (error) {
					await store.dispatch('user/resetToken');
					Message.error(error || 'Has Error');
					next(`/login?redirect=${to.path}`);
					NProgress.done();
				}
			}
		}
	} else {
		// console.log("沒有token")
		if (whiteList.indexOf(to.path) !== -1) {
			next();
		} else {
			next(`/login?redirect=${to.path}`);
			NProgress.done();
		}
	}
})

router.afterEach(() => {
	NProgress.done();
})
