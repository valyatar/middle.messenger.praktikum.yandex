import { UserService } from '../services/UserService';

export class UserController {
    constructor(private userService: UserService) {}

    async updateProfile(profileData: {
        first_name: string;
        second_name: string;
        display_name: string;
        login: string;
        email: string;
        phone: string;
    }): Promise<boolean> {
        try {
            const updatedUser = await this.userService.changeProfile(profileData);
            this.updateStoredUser(updatedUser);
            return true;
        } catch (error) {
            console.error('Profile update failed:', error);
            return false;
        }
    }

    async updateAvatar(avatarFile: File): Promise<boolean> {
        try {
            const updatedUser = await this.userService.changeAvatar(avatarFile);
            this.updateStoredUser(updatedUser);
            return true;
        } catch (error) {
            console.error('Avatar update failed:', error);
            return false;
        }
    }

    async changePassword(oldPassword: string, newPassword: string): Promise<boolean> {
        try {
            await this.userService.changePassword({ oldPassword, newPassword });
            return true;
        } catch (error) {
            console.error('Password change failed:', error);
            return false;
        }
    }

    async searchUsers(login: string): Promise<any[]> {
        try {
            return await this.userService.searchUser(login);
        } catch (error) {
            console.error('User search failed:', error);
            return [];
        }
    }

    private updateStoredUser(user: any) {
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        const updatedUser = { ...currentUser, ...user };
        localStorage.setItem('user', JSON.stringify(updatedUser));
    }
}