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
public class M {

    public M() {
    }
    
    //additional Math
    
    public static double deg2rad(double d){
        return (d / 180) * Math.PI;
    }
    
    public static double rad2deg(double d){
        return d * 57.29577951308232;
    }
    
    public static double sin(double d){
        return Math.sin(deg2rad(d));
    }
    
    public static double cos(double d){
        return Math.cos(deg2rad(d));
    }
    
    public static double tan(double d){
        return Math.tan(deg2rad(d));
    }
    
    public static double acos(double r){
        return rad2deg(Math.acos(r));
    }
    
    public static double asin(double r){
        return rad2deg(Math.asin(r));
    }
    
    public static double atan(double r){
        return rad2deg(Math.atan(r));
    }
}
