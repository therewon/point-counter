# Point Counter multiplayer qurulması

## Firebase Console

1. Firebase Console-da `point-counter-4d4d7` layihəsini açın.
2. **Build → Realtime Database → Create Database** bölməsinə keçin.
3. Database-i **Locked mode** ilə yaradın. Test mode istifadə etməyin.
4. Yaradılan database URL-ni kopyalayın.
5. URL default ABŞ formatından fərqlidirsə, `.env` faylındakı
   `VITE_FIREBASE_DATABASE_URL` dəyərini həmin URL ilə əvəz edin.
6. **Realtime Database → Rules** bölməsində `database.rules.json` faylının
   məzmununu yerləşdirib yayımlayın.

Rules Firebase CLI ilə də yayımlana bilər:

```bash
firebase deploy --only database --project point-counter-4d4d7
```

## Environment dəyişəni

```env
VITE_FIREBASE_DATABASE_URL=https://point-counter-4d4d7-default-rtdb.firebaseio.com
```

Database başqa regionda yaradılıbsa Firebase Console-da göstərilən dəqiq URL-ni
istifadə edin. Vite bu dəyəri build zamanı paketə daxil etdiyi üçün URL
dəyişdikdən sonra tətbiqi yenidən build və deploy etmək lazımdır.

## İki istifadəçi ilə test

1. Bir normal pəncərə və bir Incognito/Private pəncərə açın.
2. Hər pəncərədə fərqli Firebase istifadəçisi ilə daxil olun.
3. Birinci istifadəçi `/multiplayer` səhifəsində otaq yaratsın.
4. İkinci istifadəçi 6 simvolluq kodla otağa qoşulsun.
5. Hər iki cihazda oyunçu siyahısının dərhal yeniləndiyini yoxlayın.
6. Host oyunu başlatsın.
7. Hər istifadəçi yalnız öz kartındakı `-10`, `-1`, `+1`, `+10` düymələrini
   yoxlasın.
8. Bir pəncərəni bağlayaraq digər pəncərədə həmin oyunçunun offline göründüyünü
   yoxlayın.
9. Host `Otaqdan çıx` düyməsini istifadə etsin və yeni host-un təyin olunduğunu
   yoxlayın.
10. Hədəf xala çatın, qalib pəncərəsinin hər iki cihazda açıldığını və host-un
    oyunu sıfırlaya bildiyini yoxlayın.

## Client-side təhlükəsizlik sərhədləri

- Rules yalnız autentifikasiya olunmuş istifadəçilərə otaqları oxumağa imkan
  verir. Qoşulmamış istifadəçinin kodla otağı yoxlaya bilməsi üçün room code-u
  bilən hər autentifikasiya olunmuş istifadəçi həmin otağı oxuya bilər.
- Hər oyunçu yalnız öz xalını dəqiq icazəli addımlarla dəyişə bilər.
- Rules host status keçidlərini və score tiplərini yoxlayır, amma dinamik oyunçu
  sayını etibarlı şəkildə saya bilmir. Minimum iki oyunçu şərti client-də
  yoxlanılır.
- Tam server etibarlı anti-cheat, rate limiting və host-un otağı qəsdən silməsinin
  qarşısını almaq üçün Cloud Functions və ya başqa etibarlı backend tələb olunur.
  Bu layihə tələbinə uyğun olaraq ayrıca backend əlavə edilməyib.
