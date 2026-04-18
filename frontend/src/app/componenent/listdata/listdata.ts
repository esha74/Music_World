import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, DoCheck, OnInit } from '@angular/core';
import { Music } from '../../models/music';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Musicservices } from '../../services/musicservices';
import { Authservices } from '../../services/authservices';
import Swal from 'sweetalert2';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { User } from '../../models/user';



@Component({
  selector: 'app-listdata',
  imports: [CommonModule, RouterLink],
  templateUrl: './listdata.html',
  styleUrl: './listdata.css'
})
export class Listdata implements OnInit {
  MusicList: Music[] = [];
  showPlayer = false;
  currentVideoUrl: string = '';
  showFavoritesOnly = false;
  userrole: string | null = ''
  username: string | null = ''
storedProfileImage: string | null=null ;
baseUrl = 'https://localhost:7074'; 


 
  isAdmin = false;
  usersList: User[] = [];


  constructor(private router: Router, private musicservices: Musicservices, private cdr: ChangeDetectorRef, private authservices: Authservices, private sanitizer: DomSanitizer
  ) { }



  ngOnInit(): void {
    this.loadMusic();
    // if (typeof window !== 'undefined' && window.localStorage) {
    //   this.userrole = localStorage.getItem('userrole');
    // }
    // const user = JSON.parse(localStorage.getItem('userrole') || '{}');
    // console.log(user);
    // this.isAdmin = user.role === 'Admin';

    this.userrole = localStorage.getItem('userrole') || '';
    this.username = localStorage.getItem('username');
    // Set isAdmin based on correct role check
    this.isAdmin = this.userrole.toLowerCase() === 'admin';
    this.storedProfileImage = localStorage.getItem('imagepath');

    this.cdr.detectChanges();

  }

 
  loadMusic() {
    this.musicservices.getAll().subscribe((data) => {
      this.MusicList = data.map(m => ({ ...m, isFavorite: false }));
      this.cdr.detectChanges();
    })
  }
  get filteredMusicList() {
    if (this.showFavoritesOnly) {
      return this.MusicList.filter(m => m.isFavorite);
    }
    return this.MusicList;
  }

  toggleFavorite(music: Music, event: MouseEvent) {
    event.stopPropagation(); // prevent opening video
    music.isFavorite = !music.isFavorite;
  }

  toggleFavoriteFilter() {
    this.showFavoritesOnly = !this.showFavoritesOnly;
  }

  showAllUsers() {
    this.router.navigate(['/users']);  // navigate to new user list route
  }
  
  showActivityLog() {
  this.router.navigate(['/activity-log']);
}

  EditMusic(id: number) {
    this.router.navigate(['/edit', id])
  }
  
goEditProfile(): void {
  // Replace 'userId' with logic to get the current user's ID.
  const userId = localStorage.getItem('userid');
  this.router.navigate(['/edit-profile', userId]);
}


  DeleteMusic(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you really want to delete this music?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.musicservices.delete(id).subscribe(() => {
          this.loadMusic();
          Swal.fire(
            'Deleted!',
            'Your music has been deleted.',
            'success'
          );
        });
      }
    });
  }


  AddMusic() {
    this.router.navigate(['/add']);
  }
  logout(): void {
    this.authservices.removeToken();
    localStorage.removeItem('userrole');
    localStorage.removeItem('username');
    localStorage.removeItem('imagepath');
    localStorage.removeItem('userid')
    // Redirect to login
    this.router.navigate(['/login']);
  }


  openVideo(url: string) {
    this.currentVideoUrl = url;
    this.showPlayer = true;
  }

  closeVideo() {
    this.showPlayer = false;
    this.currentVideoUrl = '';
  }

  // Your existing getSafeUrl method to sanitize URLs
  getSafeUrl(youtubeUrl: string): SafeResourceUrl {
    const videoId = this.extractVideoId(youtubeUrl);
    return this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${videoId}`);
  }

  // Your existing method to extract video ID from URL
  extractVideoId(url: string): string {
    const regex = /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([\w-]+)/;
    const match = url.match(regex);
    return match ? match[1] : '';
  }

downloadMusic(music: Music) {
  const isSubscribed = localStorage.getItem('isSubscribed') === 'true';

  if (!isSubscribed) {
    Swal.fire({
      icon: 'info',
      title: 'Subscription Required',
      text: 'You need to subscribe to download songs.',
      confirmButtonText: 'Subscribe Now'
    }).then(() => {
      this.router.navigate(['/subscribe']);
    });
    return;
  }

  // Perform download (open audio file link)
  // const link = document.createElement('a');
  // link.href = music.audio;
  // link.download = music.title + '.mp3'; // Set desired file name
  // document.body.appendChild(link);
  // link.click();
  // document.body.removeChild(link);

   // Show success message after download starts
  Swal.fire({
    icon: 'success',
    title: 'Download Started',
    text: `Downloading ${music.title}.`
 });
}

}
