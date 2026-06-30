package com.mtp.api.controllers;

import com.mtp.api.models.Province;
import com.mtp.api.models.District;
import com.mtp.api.models.Commune;
import com.mtp.api.models.Village;
import com.mtp.api.repositories.ProvinceRepository;
import com.mtp.api.repositories.DistrictRepository;
import com.mtp.api.repositories.CommuneRepository;
import com.mtp.api.repositories.VillageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/locations")
public class LocationController {

    @Autowired
    private ProvinceRepository provinceRepository;
    
    @Autowired
    private DistrictRepository districtRepository;
    
    @Autowired
    private CommuneRepository communeRepository;
    
    @Autowired
    private VillageRepository villageRepository;

    @GetMapping("/provinces")
    public List<Province> getProvinces() {
        return provinceRepository.findAll();
    }

    @PostMapping("/provinces")
    public Province createProvince(@RequestBody Province province) {
        return provinceRepository.save(province);
    }

    @PutMapping("/provinces/{id}")
    public Province updateProvince(@PathVariable Integer id, @RequestBody Province provinceDetails) {
        return provinceRepository.findById(id).map(province -> {
            province.setNameEn(provinceDetails.getNameEn());
            province.setNameKh(provinceDetails.getNameKh());
            province.setPostcode(provinceDetails.getPostcode());
            return provinceRepository.save(province);
        }).orElseThrow();
    }

    @DeleteMapping("/provinces/{id}")
    public void deleteProvince(@PathVariable Integer id) {
        provinceRepository.deleteById(id);
    }

    // --- DISTRICTS ---
    @GetMapping("/districts")
    public List<District> getDistricts(@RequestParam Integer provinceId) {
        return districtRepository.findByProvinceId(provinceId);
    }

    @PostMapping("/districts")
    public District createDistrict(@RequestBody District district) {
        return districtRepository.save(district);
    }

    @PutMapping("/districts/{id}")
    public District updateDistrict(@PathVariable Integer id, @RequestBody District districtDetails) {
        return districtRepository.findById(id).map(district -> {
            district.setNameEn(districtDetails.getNameEn());
            district.setNameKh(districtDetails.getNameKh());
            district.setProvinceId(districtDetails.getProvinceId());
            district.setPostcode(districtDetails.getPostcode());
            return districtRepository.save(district);
        }).orElseThrow();
    }

    @DeleteMapping("/districts/{id}")
    public void deleteDistrict(@PathVariable Integer id) {
        districtRepository.deleteById(id);
    }

    // --- COMMUNES ---
    @GetMapping("/communes")
    public List<Commune> getCommunes(@RequestParam Integer districtId) {
        return communeRepository.findByDistrictId(districtId);
    }

    @PostMapping("/communes")
    public Commune createCommune(@RequestBody Commune commune) {
        return communeRepository.save(commune);
    }

    @PutMapping("/communes/{id}")
    public Commune updateCommune(@PathVariable Integer id, @RequestBody Commune communeDetails) {
        return communeRepository.findById(id).map(commune -> {
            commune.setNameEn(communeDetails.getNameEn());
            commune.setNameKh(communeDetails.getNameKh());
            commune.setDistrictId(communeDetails.getDistrictId());
            commune.setPostcode(communeDetails.getPostcode());
            return communeRepository.save(commune);
        }).orElseThrow();
    }

    @DeleteMapping("/communes/{id}")
    public void deleteCommune(@PathVariable Integer id) {
        communeRepository.deleteById(id);
    }

    // --- VILLAGES ---
    @GetMapping("/villages")
    public List<Village> getVillages(@RequestParam Integer communeId) {
        return villageRepository.findByCommuneId(communeId);
    }

    @PostMapping("/villages")
    public Village createVillage(@RequestBody Village village) {
        return villageRepository.save(village);
    }

    @PutMapping("/villages/{id}")
    public Village updateVillage(@PathVariable Integer id, @RequestBody Village villageDetails) {
        return villageRepository.findById(id).map(village -> {
            village.setNameEn(villageDetails.getNameEn());
            village.setNameKh(villageDetails.getNameKh());
            village.setCommuneId(villageDetails.getCommuneId());
            village.setPostcode(villageDetails.getPostcode());
            return villageRepository.save(village);
        }).orElseThrow();
    }

    @DeleteMapping("/villages/{id}")
    public void deleteVillage(@PathVariable Integer id) {
        villageRepository.deleteById(id);
    }
}
