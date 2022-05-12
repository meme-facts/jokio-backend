import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class notifications1652141136393 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'notifications',
                columns: [
                    {
                        name:'id',
                        type: 'uuid',
                        isPrimary:true
                    },
                    {
                        name: 'type',
                        type: 'char',
                    },
                    {
                        name: 'userId',
                        type: 'uuid'
                    },
                    {
                        name: 'postId',
                        type: 'uuid'
                    }, 
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'now()'
                    },                
                ],
                foreignKeys: [
                    {
                      name: 'FKUserComment',
                      referencedTableName: 'users',
                      referencedColumnNames: ['id'],
                      columnNames: ['userId'],
                      onDelete: 'SET NULL',
                      onUpdate: 'SET NULL',
                    },
                    {
                      name: 'FKPostComment',
                      referencedTableName: 'posts',
                      referencedColumnNames: ['id'],
                      columnNames: ['postId'],
                      onDelete: 'SET NULL',
                      onUpdate: 'SET NULL',
                    },
                  ],
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('notifications')
    }

}
