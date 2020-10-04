const express = require("express");
const router = express.Router();
const { SendResponse } = require("../../util/utility");
const queries = require("../../util/T-SQL/queries");
const setting = require("../../app-setting");
const sworm = require("sworm");
const { json } = require("express");
const db = sworm.db(setting.db.sqlConfig);

router.route('/')
    .get(async (req, res) => {
        let menu2 = [
            { name: 'Gate', key: 'gate', child: [] },
            {
                name: 'billing', key: 'billing', child: [
                    { name: 'Warehouse', key: 'warehouse', child: [] },
                    {
                        name: 'Strip', key: 'strip', child: [
                            { name: 'create', key: 'strip-create', child: [] },
                            { name: 'edit', key: 'strip-edit', child: [] },
                            { name: 'delete', key: 'strip-delete', child: [] },
                            { name: 'print', key: 'strip-print', child: [] }
                        ]
                    }
                ]
            }
        ]
        
        
        let permissionList = [
            { name: 'gate', isGranted: false },
            { name: 'billing', isGranted: true },
            { name: 'warehouse', isGranted: true },
            { name: 'strip', isGranted: true },
            { name: 'strip-delete', isGranted: false }
        ]
        
        let permissions = permissionList
            .filter(m => m.isGranted == false)
            .map(n => n.name);
        
        let result = [];
        permissions.forEach(p => { result = filterData(menu2, p) })
                
        function filterData(data, key) {
         
            var r = data.filter(function (o) {
                if (o.child)
                    o.child = filterData(o.child, key);
                return o.key != key
            })
            return r;
        }
        SendResponse(req, res, result)
    })
    .post(async (req, res) => {
        SendResponse(req, res, { capitan: 'Added' })
    })
    .put(async (req, res) => {
        SendResponse(req, res, { capitan: 'Updated' })
    })
    .delete(async (req, res) => {
        SendResponse(req, res, { capitan: 'Deleted' })
    })

module.exports = router;
