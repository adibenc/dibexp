/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package wsholat;

/**
 *
 * @author x7a616d
 */
public class WS {
    /**
 * Waktu Sholat Javascript Library
 *
 * @author     Ahmad Amarullah <amarullz@yahoo.com>
 * @copyright  2011 Unikom Center <http://www.unikomcenter.com/>
 * @license    http://www.unikomcenter.com/license/ UnikomCenter License 1.0
 * @version    1.0.0
 * 
 * 
 * Translated to java by 0x4164
 * M Adib zamzam
 * https://github.com/0x4164
 * 
 * 
 */
        /* Koordinate Default = Bandung */
    double latitude;
    double longitude;
    
    /* Ikhtiyat/Kehati-hatian sebanyak 2 Menit */
    double ikhtiyat;

    /**
     * Set Latitude & Longitude
     * @sintax
     *   void Object.setLatLng(float Latitude, float Longitude);
     */
    
    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }

    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }
    
    public void setLatLng(double latitude,double longitude) {
        this.latitude = latitude;
        this.longitude = longitude;
    }
    
    /**
     * Fungsi untuk meng-convert nilai Float untuk jam
     * menjadi array [Jam,Menit,Detik] atau string jam "12:1:9"
     * @sintax
     *   string/array Object.calc_toTime(float flTime, bool ReturnArray); 
     */
    public String calctoTime(double num){
        String res="";
        double jam = Math.floor(num);
        double vmn = (num-jam)*60;
        double mnt = Math.floor(vmn);
        double dtk = Math.round((vmn-mnt)*60);
        
        res=jam+":"+mnt+":"+dtk;
        return res;
    }
    
    public String[] calctoTimeArr(double num){
        double jam = Math.floor(num);
        double vmn = (num-jam)*60;
        double mnt = Math.floor(vmn);
        double dtk = Math.round((vmn-mnt)*60);
        
        String res[]={jam+"",mnt+"",dtk+""};
        
        return res;
    }
    
//      var vmn = (num-jam)*60;
//      var dtk = Math.round((vmn-mnt)*60);
    
    /* Fungsi Untuk Convert calc_toTime menjadi
        Friendly Time format dengan leading 0 pada jam,menit
       dan detik. Output format: 12:01:09
    */
    public String timeToString(double num){
        String arr[]=this.calctoTimeArr(num);
        if (arr[0].length()<1) arr[0]='0'+arr[0];
        if (arr[1].length()<1) arr[1]='0'+arr[1];
        if (arr[2].length()<1) arr[2]='0'+arr[2];
        
        String ret=arr[0]+arr[1]+arr[2];
        
        return ret;
    }
    
    /**
     * Fungsi untuk mendapatkan Nilai Integer dari Julian Date
     * @sintax
     *   [JD] Object.jd(int Tahun, int Bulan, int Tanggal, int TimeZone); 
     */
    public double jd(int thn, int bln, int tgl, int tz){
//        int ret=0;
        double ret=0;
        if (bln<=2){
            bln+=12;
            thn--;
        }
        int UT = 12-tz;
        // Nilai 1 Tahun = 365.25 Hari ( 366 = 1x kabisat, 365 = 3x )
        // Nilai 1 Bulan = 30.6001 Hari
        // Alghoritma dapat dibaca di: http://www.gmat.unsw.edu.au/snap/gps/gps_survey/chap2/214.htm
        ret = Math.floor(365.25*thn)+Math.floor(30.6001*(bln+1))+tgl+(UT/24)+1720981.5;
//      var jd = Math.floor(365.25 * thn) + Math.floor(30.6001 * (bln+1)) + tgl + (UT/24) + 1720981.5;
        
        return ret;
    }
    
    /**
     * Julian Date untuk 1 Januari 2000 (UTC)
     * diperlukan untuk perhitungan jumlah hari dan
     * abad untuk hari yang dimaksud.
     */
    double JD2000 = this.jd(2000,1,1,0);
    
    /**
     * Fungsi untuk menghitung jumlah hari dari satu
     * JD ke JD yang lainnya
     * @sintax
     *   [n] Object.jd_jumlahHari([JD] From,[JD] To);
     */
    public double jd_jumlahHari(double jdfrom,double jdto){
        return jdto-jdfrom;
    }
    
    /**
     * Fungsi untuk menghitung jumlah abad untuk
     * jumlah hari yang dimaksud.
     * @sintax
     *   [T] Object.jd_jumlahAbad([JD] jumlahHari);
     */
    public double jd_jumlahAbad(double jumlahHari){
        /* Jumlah Hari dalam 1 Abad = 36525 Hari */
        return jumlahHari/36525;
    }
    
    /**
     * Fungsi untuk menghitung bujur ekliptik rata-rata matahari
     * @sintax
     *   [g] Object.elip_ratarata([T] jumlahAbad);
     */
    public double elip_ratarata(double jumlahAbad){
        double ret=0;
        
        double g_awal=280.46 + (36000.77129 * jumlahAbad);
        double g = g_awal;
        if (g_awal>360) {
            double cg = 360*Math.floor(g_awal/360);
            g-=cg;
        }
        ret=g;
        
        return ret;
    }
    
    //additional Math
    //kelas M
    //mbo
    
    M m;
    
//      var g_awal= 280.46 + (36000.77129 * T);
//        var cg = 360 * Math.floor(g_awal/360);
//        return (d / 180) * Math.PI;
//        return d * 57.29577951308232;
    /**
     * Fungsi untuk menghitung bujur ekliptik matahari
     * @sintax
     *   [L0] Object.elip_bujur([T] jumlahAbad);
     */
    public double elip_bujur(double T){
        double ret=0;
        double b_awal = 357.528+(35999.05096*T);
        double c_b    = 360 * Math.floor(b_awal/360);
        double b      = b_awal - c_b;
        double lo     = this.elip_ratarata(T) + (1.915 * M.sin(b)) + (0.02 * M.sin(2*b));
    
        ret=lo;
        
        return ret;
    }
    
    /**
     * Fungsi untuk menghitung kemiringan ekliptik matahari
     * @sintax
     *   [E] Object.elip_kemiringan([n] jumlahHari);
     */
    public double elip_kemiringan(double n){
        return 23.439-0.0000004*n;
    }

    /**
     * Fungsi untuk menghitung Aksensio rekta matahari
     * @sintax
     *   [Ra0] Object.cari_ra0([L0] elipBujur, [E] Kemiringan);
     */
    public double cari_ra0(double L0,double E){
        double _L0    = L0;
        double _E     = E;
        double cos_L0 = M.cos(_L0);

        double Ra01   = M.atan((M.sin(_L0) * M.cos(_E)) / cos_L0);
        double Ra02   = Ra01;
        if (cos_L0>=0)
          Ra02+=360;
        else
          Ra02+=180;
        
        double CRa = 360 * Math.floor(Ra02/360);
        double Ra0 = Ra02-CRa;
        
        return Ra0;
    }
    
//      var Ra01   = M.atan((M.sin(_L0) * M.cos(_E)) / cos_L0);
//      var CRa = 360 * Math.floor(Ra02/360);
    /**
     * Fungsi untuk menghitung deklinasi matahari
     * @sintax
     *   [d0] Object.cari_deklinasi([L0] elipBujur, [E] Kemiringan);
     */
    public double cari_deklinasi(double L0,double E){
        double d0 = M.asin(M.sin(L0) * M.sin(E));
        return d0;
    }
    
//      var d0 = M.asin(M.sin(L0) * M.sin(E));
    /**
     * Fungsi untuk menghitung Meridian Pas
     * @sintax
     *   [MP] Object.cari_meridianpas([Ra0] Aksensio, [g] elip_ratarata);
     */
    public double cari_meridianpas(double Ra0,double g){
        double MP = (12-((g-Ra0)/15));
        if (MP<0)
          MP+=24;
        else if(MP>24)
          MP-=24;
        return MP;
    }
    
    /**
     * Fungsi untuk menghitung Koreksi Waktu Daerah
     * @sintax
     *   [KWD] Object.calc_kwd(int TimeZone,float Longitude);
     */
    public double calc_kwd(double tz,double longitude){
        double KWD = tz - (longitude/15);
        return KWD;
    }
    
    /**
     * Fungsi Untuk menghitung Waktu pada kondisi-kondisi tertentu
     *  [WAKTU] Object.calcWaktu([d0],float,[KWD],[MP],int DerajatMatahari);
     */
    public double calcWaktu(double d0,double latitude,double KWD,double MP,double Z){
        double t = 0;
        if (Z!=0){
          double _Z   = Math.abs(Z);
          double cosZ = (M.cos(_Z) - M.sin(d0) * M.sin(latitude)) / (M.cos(d0) * M.cos(latitude));
          t = M.acos(cosZ) / 15;
          if (Z<0) t = 0-t;
        }
        double Waktu = MP + t + KWD + (this.ikhtiyat/60);
        return Waktu;
    }
    
//        var cosZ = (M.cos(_Z) - M.sin(d0) * M.sin(latitude)) / (M.cos(d0) * M.cos(latitude));
    /**
     * Fungsi Untuk Mendapatkan Waktu Sholat
     * Berdasarkan Thn, Bln, Tgl dan TimeZone.
     */
//    public String[] getWaktuSholat(double thn,double bln,double tgl,double gmt){
    public String[] getWaktuSholat(int thn,int bln,int tgl,int gmt){
        //-- Bila tidak di set, Set sebagai WIB / GMT+7
        if (gmt<0) gmt=7;

        //-- Hitung Julian Date hari yang dimaksud
        double JD     = this.jd(thn,bln,tgl,gmt);
        //-- Hitung jumlah Hari dari 1 Jan 2000 sampai tgl yg dimaksud
        double n      = this.jd_jumlahHari(this.JD2000,JD);
        //-- Hitung jumlah Abad dari 1 Jan 2000 sampai tgl yg dimaksud
        double T      = this.jd_jumlahAbad(n);
        //-- Hitung Bujur ekliptik rata-rata matahari
        double g      = this.elip_ratarata(T);
        //-- Hitung Bujur ekliptik matahari
        double Lo     = this.elip_bujur(T);
        //-- Hitung kemiringan ekliptik matahari
        double E      = this.elip_kemiringan(n);
        //-- Hitung Aksensio rekta matahari
        double Ra0    = this.cari_ra0(Lo, E);
        //-- Hitung Deklinasi matahari
        double d0     = this.cari_deklinasi(Lo,E);
        //-- Hitung Meridian Pas
        double MP     = this.cari_meridianpas(Ra0,g);
        //-- Hitung Koreksi Waktu Daerah
        double KWD    = this.calc_kwd(gmt,this.longitude);
        
        /* List Posisi Matahari Berdasarkan Waktu Shalat */
        
        double posMatahari[]={0,
            /* Ashar tergantung koordinat latitude dari suatu daerah */
            M.atan(M.tan(Math.abs(d0-this.latitude))+1),
            91,108,-110};
        
        String [] waktuSholat=new String[posMatahari.length];
        for (int waktu=0;waktu<posMatahari.length;waktu++) {
//            System.out.println("w"+waktu);
            this.calcWaktu(d0,this.latitude,KWD,MP,posMatahari[waktu]);
            waktuSholat[waktu]=this.timeToString(
                    this.calcWaktu(d0,this.latitude,KWD,MP,posMatahari[waktu])
            );
        }
        
        return waktuSholat;
    }
      
    public static void main(String[] args) {
        WS ws = new WS();
        
        //bandung
        double latitude   = -6.920633;
        double longitude  = 107.603703;
//        ws.setLatLng(latitude, longitude);
        
        //dib
        //-7.872447, 112.531276
        ws.setLatLng(-7.872447, 112.531276);
        
        String res[]=ws.getWaktuSholat(2019, 4, 4, 7);
        
        String wsh[]={"dhuhr","asr","magrib","isya","subh"};
        for (int i = 0; i < res.length; i++) {
            System.out.println(wsh[i]+" : "+res[i]);
        }
//        String w2=ws.timeToString(w1);
        
//        System.out.println("w2 "+w2);
//        System.out.println("m1"+Math);
    }
}
